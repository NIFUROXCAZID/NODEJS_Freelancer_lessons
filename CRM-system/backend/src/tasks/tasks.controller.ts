import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { UserRole } from '../users/enums/user-role.enum';
import { GetTasksDto } from './dto/get-tasks.dto';

import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser('sub') currentUserId: number,
  ) {
    return this.tasksService.create(createTaskDto, currentUserId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') currentUserRole: UserRole,
  ) {
    return this.tasksService.findOne(id, currentUserId, currentUserRole);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  findAll(
    @Query() query: GetTasksDto,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.tasksService.findAll(query, currentUserId, role);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.tasksService.remove(id, currentUserId, role);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.tasksService.update(id, dto, currentUserId, role);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.tasksService.updateStatus(id, dto, currentUserId, role);
  }
}
