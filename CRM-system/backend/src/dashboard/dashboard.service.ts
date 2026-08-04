import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

import { Project } from '../projects/entities/project.entity';
import { ProjectStatus } from '../projects/enums/project-status.enum';
import { ProjectPriority } from '../projects/enums/project-priority.enum';

import { Task } from '../tasks/entities/task.entity';
import { TaskStatus } from '../tasks/enums/task-status.enum';
import { TaskPriority } from '../tasks/enums/task-priority.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,

    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getAdminStatistics() {
    const now = new Date();

    const [
      totalUsers,
      totalAdmins,
      totalManagers,
      totalWorkers,
      activeUsers,

      totalProjects,
      activeProjects,
      completedProjects,

      lowPriorityProjects,
      mediumPriorityProjects,
      highPriorityProjects,
      criticalPriorityProjects,

      totalTasks,
      todoTasks,
      inProgressTasks,
      inReviewTasks,
      doneTasks,
      overdueTasks,

      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks,
      criticalPriorityTasks,
    ] = await Promise.all([
      // Користувачі

      this.usersRepository.count(),

      this.usersRepository.count({
        where: {
          role: UserRole.ADMIN,
        },
      }),

      this.usersRepository.count({
        where: {
          role: UserRole.MANAGER,
        },
      }),

      this.usersRepository.count({
        where: {
          role: UserRole.WORKER,
        },
      }),

      this.usersRepository.count({
        where: {
          isActive: true,
        },
      }),

      // Проєкти за статусом

      this.projectsRepository.count(),

      this.projectsRepository.count({
        where: {
          status: ProjectStatus.ACTIVE,
        },
      }),

      this.projectsRepository.count({
        where: {
          status: ProjectStatus.COMPLETED,
        },
      }),

      // Проєкти за пріоритетом

      this.projectsRepository.count({
        where: {
          priority: ProjectPriority.LOW,
        },
      }),

      this.projectsRepository.count({
        where: {
          priority: ProjectPriority.MEDIUM,
        },
      }),

      this.projectsRepository.count({
        where: {
          priority: ProjectPriority.HIGH,
        },
      }),

      this.projectsRepository.count({
        where: {
          priority: ProjectPriority.CRITICAL,
        },
      }),

      // Задачі за статусом

      this.tasksRepository.count(),

      this.tasksRepository.count({
        where: {
          status: TaskStatus.TODO,
        },
      }),

      this.tasksRepository.count({
        where: {
          status: TaskStatus.IN_PROGRESS,
        },
      }),

      this.tasksRepository.count({
        where: {
          status: TaskStatus.IN_REVIEW,
        },
      }),

      this.tasksRepository.count({
        where: {
          status: TaskStatus.DONE,
        },
      }),

      this.tasksRepository.count({
        where: {
          desiredDeadline: LessThan(now),
          status: Not(TaskStatus.DONE),
        },
      }),

      // Задачі за пріоритетом

      this.tasksRepository.count({
        where: {
          priority: TaskPriority.LOW,
        },
      }),

      this.tasksRepository.count({
        where: {
          priority: TaskPriority.MEDIUM,
        },
      }),

      this.tasksRepository.count({
        where: {
          priority: TaskPriority.HIGH,
        },
      }),

      this.tasksRepository.count({
        where: {
          priority: TaskPriority.CRITICAL,
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        admins: totalAdmins,
        managers: totalManagers,
        workers: totalWorkers,
        active: activeUsers,
      },

      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,

        byPriority: {
          low: lowPriorityProjects,
          medium: mediumPriorityProjects,
          high: highPriorityProjects,
          critical: criticalPriorityProjects,
        },
      },

      tasks: {
        total: totalTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        inReview: inReviewTasks,
        done: doneTasks,
        overdue: overdueTasks,

        byPriority: {
          low: lowPriorityTasks,
          medium: mediumPriorityTasks,
          high: highPriorityTasks,
          critical: criticalPriorityTasks,
        },
      },
    };
  }

  async getPersonalStatistics(currentUserId: number, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.getAdminStatistics();
    }

    if (role === UserRole.MANAGER) {
      return this.getManagerStatistics(currentUserId);
    }

    return this.getWorkerStatistics(currentUserId);
  }

  private async getManagerStatistics(managerId: number) {
    const now = new Date();

    const [
      totalProjects,
      activeProjects,
      completedProjects,

      lowPriorityProjects,
      mediumPriorityProjects,
      highPriorityProjects,
      criticalPriorityProjects,

      totalTasks,
      todoTasks,
      inProgressTasks,
      inReviewTasks,
      doneTasks,
      overdueTasks,

      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks,
      criticalPriorityTasks,
    ] = await Promise.all([
      // Проєкти менеджера за статусом

      this.projectsRepository.count({
        where: {
          managerId,
        },
      }),

      this.projectsRepository.count({
        where: {
          managerId,
          status: ProjectStatus.ACTIVE,
        },
      }),

      this.projectsRepository.count({
        where: {
          managerId,
          status: ProjectStatus.COMPLETED,
        },
      }),

      // Проєкти менеджера за пріоритетом

      this.projectsRepository.count({
        where: {
          managerId,
          priority: ProjectPriority.LOW,
        },
      }),

      this.projectsRepository.count({
        where: {
          managerId,
          priority: ProjectPriority.MEDIUM,
        },
      }),

      this.projectsRepository.count({
        where: {
          managerId,
          priority: ProjectPriority.HIGH,
        },
      }),

      this.projectsRepository.count({
        where: {
          managerId,
          priority: ProjectPriority.CRITICAL,
        },
      }),

      // Усі задачі проєктів менеджера

      this.countManagerTasks(managerId),

      this.countManagerTasksByStatus(managerId, TaskStatus.TODO),

      this.countManagerTasksByStatus(managerId, TaskStatus.IN_PROGRESS),

      this.countManagerTasksByStatus(managerId, TaskStatus.IN_REVIEW),

      this.countManagerTasksByStatus(managerId, TaskStatus.DONE),

      this.tasksRepository
        .createQueryBuilder('task')
        .innerJoin('task.project', 'project')
        .where('project.managerId = :managerId', {
          managerId,
        })
        .andWhere('task.desiredDeadline < :now', {
          now,
        })
        .andWhere('task.status != :doneStatus', {
          doneStatus: TaskStatus.DONE,
        })
        .getCount(),

      // Задачі менеджера за пріоритетом

      this.countManagerTasksByPriority(managerId, TaskPriority.LOW),

      this.countManagerTasksByPriority(managerId, TaskPriority.MEDIUM),

      this.countManagerTasksByPriority(managerId, TaskPriority.HIGH),

      this.countManagerTasksByPriority(managerId, TaskPriority.CRITICAL),
    ]);

    return {
      role: UserRole.MANAGER,

      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,

        byPriority: {
          low: lowPriorityProjects,
          medium: mediumPriorityProjects,
          high: highPriorityProjects,
          critical: criticalPriorityProjects,
        },
      },

      tasks: {
        total: totalTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        inReview: inReviewTasks,
        done: doneTasks,
        overdue: overdueTasks,

        byPriority: {
          low: lowPriorityTasks,
          medium: mediumPriorityTasks,
          high: highPriorityTasks,
          critical: criticalPriorityTasks,
        },
      },
    };
  }

  private async getWorkerStatistics(workerId: number) {
    const now = new Date();

    const [
      totalTasks,
      todoTasks,
      inProgressTasks,
      inReviewTasks,
      doneTasks,
      overdueTasks,

      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks,
      criticalPriorityTasks,
    ] = await Promise.all([
      // Задачі робітника за статусом

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
        },
      }),

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          status: TaskStatus.TODO,
        },
      }),

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          status: TaskStatus.IN_PROGRESS,
        },
      }),

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          status: TaskStatus.IN_REVIEW,
        },
      }),

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          status: TaskStatus.DONE,
        },
      }),

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          desiredDeadline: LessThan(now),
          status: Not(TaskStatus.DONE),
        },
      }),

      // Задачі робітника за пріоритетом

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          priority: TaskPriority.LOW,
        },
      }),

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          priority: TaskPriority.MEDIUM,
        },
      }),

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          priority: TaskPriority.HIGH,
        },
      }),

      this.tasksRepository.count({
        where: {
          assignedWorkerId: workerId,
          priority: TaskPriority.CRITICAL,
        },
      }),
    ]);

    return {
      role: UserRole.WORKER,

      tasks: {
        total: totalTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        inReview: inReviewTasks,
        done: doneTasks,
        overdue: overdueTasks,

        byPriority: {
          low: lowPriorityTasks,
          medium: mediumPriorityTasks,
          high: highPriorityTasks,
          critical: criticalPriorityTasks,
        },
      },
    };
  }

  private countManagerTasks(managerId: number) {
    return this.tasksRepository
      .createQueryBuilder('task')
      .innerJoin('task.project', 'project')
      .where('project.managerId = :managerId', {
        managerId,
      })
      .getCount();
  }

  private countManagerTasksByStatus(managerId: number, status: TaskStatus) {
    return this.tasksRepository
      .createQueryBuilder('task')
      .innerJoin('task.project', 'project')
      .where('project.managerId = :managerId', {
        managerId,
      })
      .andWhere('task.status = :status', {
        status,
      })
      .getCount();
  }

  private countManagerTasksByPriority(
    managerId: number,
    priority: TaskPriority,
  ) {
    return this.tasksRepository
      .createQueryBuilder('task')
      .innerJoin('task.project', 'project')
      .where('project.managerId = :managerId', {
        managerId,
      })
      .andWhere('task.priority = :priority', {
        priority,
      })
      .getCount();
  }
}
