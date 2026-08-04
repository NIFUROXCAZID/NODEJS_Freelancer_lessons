import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './enums/project-status.enum';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Task } from '../tasks/entities/task.entity';
import { TaskStatus } from '../tasks/enums/task-status.enum';
import { ProjectSortBy } from './enums/project-sort-by.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,

    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    private readonly usersService: UsersService,
  ) {}

  async create(createProjectDto: CreateProjectDto, createdById: number) {
    const manager = await this.usersService.findEntityById(
      createProjectDto.managerId,
    );

    if (!manager) {
      throw new NotFoundException('Керівника не знайдено');
    }

    if (manager.role !== UserRole.MANAGER) {
      throw new BadRequestException(
        'Призначений користувач повинен мати роль MANAGER',
      );
    }

    if (!manager.isActive) {
      throw new BadRequestException(
        'Не можна призначити заблокованого керівника',
      );
    }

    const creator = await this.usersService.findEntityById(createdById);

    if (!creator) {
      throw new NotFoundException(
        'Користувача, який створює проєкт, не знайдено',
      );
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      manager,
      managerId: manager.id,
      createdBy: creator,
      createdById: creator.id,
      status: ProjectStatus.ACTIVE,
      completedAt: null,
    });

    const savedProject = await this.projectsRepository.save(project);

    return this.findOneById(savedProject.id);
  }

  async findAll(
    queryDto: ProjectQueryDto,
    currentUserId: number,
    currentUserRole: UserRole,
  ) {
    const {
      page,
      limit,
      all,
      status,
      priority,
      managerId,
      search,
      sortBy,
      sortOrder,
    } = queryDto;

    const query = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.manager', 'manager')
      .leftJoinAndSelect('project.createdBy', 'createdBy');

    if (currentUserRole === UserRole.MANAGER) {
      query.andWhere('project.managerId = :currentUserId', {
        currentUserId,
      });
    }

    if (currentUserRole === UserRole.WORKER) {
      query
        .innerJoin(
          'project.tasks',
          'visibleTask',
          'visibleTask.assignedWorkerId = :currentUserId',
          {
            currentUserId,
          },
        )
        .distinct(true);
    }

    if (status) {
      query.andWhere('project.status = :status', {
        status,
      });
    }

    if (priority) {
      query.andWhere('project.priority = :priority', {
        priority,
      });
    }

    if (managerId) {
      query.andWhere('project.managerId = :managerId', {
        managerId,
      });
    }

    if (search?.trim()) {
      query.andWhere(
        `(
        project.title LIKE :search
        OR project.description LIKE :search
      )`,
        {
          search: `%${search.trim()}%`,
        },
      );
    }

    if (sortBy === ProjectSortBy.PRIORITY) {
      query.addSelect(
        `
        CASE project.priority
          WHEN 'HIGH' THEN 3
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 1
          ELSE 0
        END
      `,
        'priorityOrder',
      );

      query.orderBy('priorityOrder', sortOrder);
    } else {
      const allowedSortFields: Record<ProjectSortBy, string> = {
        [ProjectSortBy.CREATED_AT]: 'project.createdAt',
        [ProjectSortBy.DESIRED_DEADLINE]: 'project.desiredDeadline',
        [ProjectSortBy.PRIORITY]: 'project.priority',
        [ProjectSortBy.STATUS]: 'project.status',
        [ProjectSortBy.TITLE]: 'project.title',
      };

      query.orderBy(allowedSortFields[sortBy], sortOrder);
    }

    if (all) {
      const [data, total] = await query.getManyAndCount();

      return {
        data,
        total,
        page: 1,
        limit: total,
        totalPages: 1,
      };
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneById(id: number) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: {
        manager: true,
        createdBy: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Проєкт не знайдено');
    }

    return project;
  }

  async findOne(id: number, currentUserId: number, currentUserRole: UserRole) {
    const query = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.manager', 'manager')
      .leftJoinAndSelect('project.createdBy', 'createdBy')
      .where('project.id = :id', { id });

    if (currentUserRole === UserRole.MANAGER) {
      query.andWhere('project.managerId = :currentUserId', {
        currentUserId,
      });
    }

    if (currentUserRole === UserRole.WORKER) {
      query.innerJoin(
        'project.tasks',
        'visibleTask',
        'visibleTask.assignedWorkerId = :currentUserId',
        {
          currentUserId,
        },
      );
    }

    const project = await query.getOne();

    if (!project) {
      throw new NotFoundException('Проєкт не знайдено');
    }

    return project;
  }

  async findEntityById(id: number): Promise<Project | null> {
    return this.projectsRepository.findOne({
      where: { id },
    });
  }

  async updateStatus(projectId: number, status: ProjectStatus) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    project.status = status;

    if (status === ProjectStatus.COMPLETED) {
      project.completedAt = new Date();
    } else {
      project.completedAt = null;
    }

    await this.projectsRepository.save(project);
  }

  async checkProjectStatus(projectId: number) {
    const tasks = await this.tasksRepository.find({
      where: {
        projectId,
      },
    });

    // Якщо задач ще немає — проєкт ACTIVE
    if (tasks.length === 0) {
      await this.updateStatus(projectId, ProjectStatus.ACTIVE);
      return;
    }

    const allCompleted = tasks.every((task) => task.status === TaskStatus.DONE);

    if (allCompleted) {
      await this.updateStatus(projectId, ProjectStatus.COMPLETED);
    } else {
      await this.updateStatus(projectId, ProjectStatus.ACTIVE);
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    currentUserId: number,
    role: UserRole,
  ) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: {
        manager: true,
        createdBy: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    // Спочатку перевіряємо права,
    // поки дані проєкту ще не змінені
    if (role === UserRole.MANAGER && project.managerId !== currentUserId) {
      throw new BadRequestException('Ви не можете редагувати чужий проєкт');
    }

    const { managerId, ...projectData } = updateProjectDto;

    // Оновлюємо звичайні поля
    Object.assign(project, projectData);

    // Менеджера може змінювати лише ADMIN
    if (managerId !== undefined) {
      if (role !== UserRole.ADMIN) {
        throw new BadRequestException(
          'Лише адміністратор може змінювати менеджера проєкту',
        );
      }

      const manager = await this.usersService.findOne(managerId);

      if (manager.role !== UserRole.MANAGER) {
        throw new BadRequestException('Обраний користувач не є менеджером');
      }

      if (!manager.isActive) {
        throw new BadRequestException(
          'Не можна призначити неактивного менеджера',
        );
      }

      project.managerId = manager.id;
      project.manager = undefined!;
    }

    await this.projectsRepository.save(project);

    return this.findOneById(project.id);
  }

  async remove(id: number, currentUserId: number, role: UserRole) {
    const project = await this.projectsRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    if (role === UserRole.MANAGER && project.managerId !== currentUserId) {
      throw new BadRequestException('Ви не можете видаляти чужий проект');
    }

    await this.projectsRepository.remove(project);

    return {
      message: `Project with id ${id} successfully deleted`,
    };
  }
}
