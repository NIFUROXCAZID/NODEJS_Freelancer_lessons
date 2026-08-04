import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enums/task-status.enum';

import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { UserRole } from '../users/enums/user-role.enum';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskSortBy } from './enums/task-sort-by.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  async findAll(queryDto: GetTasksDto, currentUserId: number, role: UserRole) {
    const { page, limit, priority, status, projectId, all, assignedWorkerId } =
      queryDto;

    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignedWorker', 'assignedWorker')
      .leftJoinAndSelect('task.createdBy', 'createdBy');

    // ===== Права доступу =====

    if (role === UserRole.MANAGER) {
      query.andWhere('project.managerId = :managerId', {
        managerId: currentUserId,
      });
    }

    if (role === UserRole.WORKER) {
      query.andWhere('task.assignedWorkerId = :workerId', {
        workerId: currentUserId,
      });
    }

    if (queryDto.search?.trim()) {
      query.andWhere(
        `(
      task.title LIKE :search
      OR task.description LIKE :search
    )`,
        {
          search: `%${queryDto.search.trim()}%`,
        },
      );
    }

    // ===== Фільтри =====

    if (priority) {
      query.andWhere('task.priority = :priority', {
        priority,
      });
    }

    if (status) {
      query.andWhere('task.status = :status', {
        status,
      });
    }

    if (projectId) {
      query.andWhere('task.projectId = :projectId', {
        projectId,
      });
    }

    if (assignedWorkerId) {
      query.andWhere('task.assignedWorkerId = :assignedWorkerId', {
        assignedWorkerId,
      });
    }

    if (queryDto.overdue === true) {
      query
        .andWhere('task.desiredDeadline < :now', {
          now: new Date(),
        })
        .andWhere('task.status != :doneStatus', {
          doneStatus: TaskStatus.DONE,
        });
    }

    if (queryDto.sortBy === TaskSortBy.PRIORITY) {
      query.addSelect(
        `
      CASE task.priority
        WHEN 'CRITICAL' THEN 4
        WHEN 'HIGH' THEN 3
        WHEN 'MEDIUM' THEN 2
        WHEN 'LOW' THEN 1
        ELSE 0
      END
    `,
        'priorityOrder',
      );

      query.orderBy('priorityOrder', queryDto.sortOrder);
    } else {
      const allowedSortFields: Record<TaskSortBy, string> = {
        [TaskSortBy.CREATED_AT]: 'task.createdAt',
        [TaskSortBy.DESIRED_DEADLINE]: 'task.desiredDeadline',
        [TaskSortBy.PRIORITY]: 'task.priority',
        [TaskSortBy.STATUS]: 'task.status',
        [TaskSortBy.TITLE]: 'task.title',
      };

      query.orderBy(allowedSortFields[queryDto.sortBy], queryDto.sortOrder);
    }

    // const allowedSortFields = {
    //   createdAt: 'task.createdAt',
    //   desiredDeadline: 'task.desiredDeadline',
    //   status: 'task.status',
    //   title: 'task.title',
    // };

    // ===== Пагінація =====

    if (all) {
      const [tasks, total] = await query.getManyAndCount();

      return {
        data: tasks,
        total,
        page: 1,
        limit: total,
        totalPages: 1,
      };
    }

    query.skip((page - 1) * limit);
    query.take(limit);

    const [tasks, total] = await query.getManyAndCount();

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(
    createTaskDto: CreateTaskDto,
    currentUserId: number,
  ): Promise<Task> {
    if (currentUserId === undefined) {
      throw new UnauthorizedException('У JWT payload відсутній id користувача');
    }

    const { projectId, assignedWorkerId, desiredDeadline, ...taskData } =
      createTaskDto;

    // 1. Перевіряємо, чи існує проєкт
    const project = await this.projectsService.findEntityById(projectId);

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    // 2. Перевіряємо призначеного працівника
    const assignedWorker =
      await this.usersService.findEntityById(assignedWorkerId);

    if (!assignedWorker) {
      throw new NotFoundException(`User with id ${assignedWorkerId} not found`);
    }

    if (assignedWorker.role !== UserRole.WORKER) {
      throw new BadRequestException('Assigned user must have WORKER role');
    }

    if (!assignedWorker.isActive) {
      throw new BadRequestException(
        'Inactive worker cannot be assigned to a task',
      );
    }

    // 3. Отримуємо автора задачі з JWT
    const createdBy = await this.usersService.findEntityById(currentUserId);

    if (!createdBy) {
      throw new NotFoundException(
        `Current user with id ${currentUserId} not found`,
      );
    }

    // 4. Створюємо Task entity
    const task = this.tasksRepository.create({
      ...taskData,

      desiredDeadline: new Date(desiredDeadline),

      status: TaskStatus.TODO,
      completedAt: null,

      project,
      projectId: project.id,

      assignedWorker,
      assignedWorkerId: assignedWorker.id,

      createdBy,
      createdById: createdBy.id,
    });

    // 5. Зберігаємо задачу в MySQL
    const savedTask = await this.tasksRepository.save(task);

    await this.projectsService.checkProjectStatus(project.id);
    // 6. Повертаємо задачу разом зі зв’язками
    return this.findOneById(savedTask.id);
  }

  async update(
    taskId: number,
    dto: UpdateTaskDto,
    currentUserId: number,
    role: UserRole,
  ): Promise<Task> {
    const task = await this.findOneById(taskId);
    const oldProjectId = task.projectId;

    // ===== Перевірка прав =====

    if (role === UserRole.MANAGER && task.project.managerId !== currentUserId) {
      throw new UnauthorizedException(
        'Ви не можете редагувати задачі чужого проєкту',
      );
    }

    // ===== Права робітника =====

    if (role === UserRole.WORKER) {
      if (task.assignedWorkerId !== currentUserId) {
        throw new UnauthorizedException('Ви не можете редагувати чужу задачу');
      }

      const allowedFields = ['status'];

      const receivedFields = Object.keys(dto);

      const forbiddenFields = receivedFields.filter(
        (field) => !allowedFields.includes(field),
      );

      if (forbiddenFields.length > 0) {
        throw new BadRequestException(
          'Робітник може змінювати лише статус задачі',
        );
      }
    }

    // ===== Назва =====

    if (dto.title !== undefined) {
      task.title = dto.title;
    }

    // ===== Опис =====

    if (dto.description !== undefined) {
      task.description = dto.description;
    }

    // ===== Пріоритет =====

    if (dto.priority !== undefined) {
      task.priority = dto.priority;
    }

    // ===== Статус =====

    if (dto.status !== undefined) {
      task.status = dto.status;

      if (dto.status === TaskStatus.DONE) {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }

    // ===== Дедлайн =====

    if (dto.desiredDeadline !== undefined) {
      task.desiredDeadline = new Date(dto.desiredDeadline);
    }

    // ===== Новий проєкт =====

    if (dto.projectId !== undefined) {
      const newProject = await this.projectsService.findOneById(dto.projectId);

      if (!newProject) {
        throw new NotFoundException('Project not found');
      }

      // Менеджер може переносити задачу
      // лише у свій проєкт
      if (role === UserRole.MANAGER && newProject.managerId !== currentUserId) {
        throw new UnauthorizedException(
          'Ви не можете перенести задачу в чужий проєкт',
        );
      }

      task.project = newProject;
      task.projectId = newProject.id;
    }

    // ===== Новий виконавець =====

    if (dto.assignedWorkerId !== undefined) {
      const worker = await this.usersService.findEntityById(
        dto.assignedWorkerId,
      );

      if (!worker) {
        throw new NotFoundException('Worker not found');
      }

      if (worker.role !== UserRole.WORKER) {
        throw new BadRequestException('Assigned user must have WORKER role');
      }

      if (!worker.isActive) {
        throw new BadRequestException('Worker is inactive');
      }

      task.assignedWorker = worker;
      task.assignedWorkerId = worker.id;
    }

    await this.tasksRepository.save(task);

    await this.projectsService.checkProjectStatus(oldProjectId);

    if (task.projectId !== oldProjectId) {
      await this.projectsService.checkProjectStatus(task.projectId);
    }

    return this.findOneById(task.id);
  }

  private async findOneById(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: {
        project: true,
        assignedWorker: true,
        createdBy: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Задачу не знайдено');
    }

    return task;
  }

  async findOne(id: number, currentUserId: number, currentUserRole: UserRole) {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignedWorker', 'assignedWorker')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .where('task.id = :id', { id });

    if (currentUserRole === UserRole.MANAGER) {
      query.andWhere('project.managerId = :currentUserId', {
        currentUserId,
      });
    }

    if (currentUserRole === UserRole.WORKER) {
      query.andWhere('task.assignedWorkerId = :currentUserId', {
        currentUserId,
      });
    }

    const task = await query.getOne();

    if (!task) {
      throw new NotFoundException('Задачу не знайдено');
    }

    return task;
  }

  async updateStatus(
    taskId: number,
    dto: UpdateTaskStatusDto,
    currentUserId: number,
    role: UserRole,
  ): Promise<Task> {
    const task = await this.findOneById(taskId);

    // ===== Перевірка робітника =====

    if (role === UserRole.WORKER) {
      if (task.assignedWorkerId !== currentUserId) {
        throw new UnauthorizedException(
          'Ви не можете змінювати статус чужої задачі',
        );
      }

      const workerTransitions: Record<TaskStatus, TaskStatus[]> = {
        [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS],

        [TaskStatus.IN_PROGRESS]: [TaskStatus.TODO, TaskStatus.IN_REVIEW],

        [TaskStatus.IN_REVIEW]: [TaskStatus.IN_PROGRESS],

        [TaskStatus.DONE]: [],
      };

      const allowedNextStatuses = workerTransitions[task.status];

      if (!allowedNextStatuses.includes(dto.status)) {
        throw new BadRequestException(
          `Неможливо змінити статус із ${task.status} на ${dto.status}`,
        );
      }
    }

    // ===== Перевірка менеджера =====

    if (role === UserRole.MANAGER && task.project.managerId !== currentUserId) {
      throw new UnauthorizedException(
        'Ви не можете змінювати статус задачі чужого проєкту',
      );
    }

    // ===== Зміна статусу =====

    task.status = dto.status;

    if (dto.status === TaskStatus.DONE) {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await this.tasksRepository.save(task);

    await this.projectsService.checkProjectStatus(task.projectId);

    return this.findOneById(task.id);
  }

  async remove(
    taskId: number,
    currentUserId: number,
    role: UserRole,
  ): Promise<{ message: string }> {
    const task = await this.findOneById(taskId);

    if (role === UserRole.MANAGER && task.project.managerId !== currentUserId) {
      throw new UnauthorizedException(
        'Ви не можете видаляти задачі чужого проєкту',
      );
    }
    if (role === UserRole.WORKER) {
      throw new UnauthorizedException('Робітник не може видаляти задачі');
    }

    const projectId = task.projectId;

    await this.tasksRepository.remove(task);

    await this.projectsService.checkProjectStatus(projectId);

    return {
      message: 'Task deleted successfully',
    };
  }
}
