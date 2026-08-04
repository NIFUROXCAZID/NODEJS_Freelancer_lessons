import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { ProjectQueryDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('sub') currentUserId: number,
  ) {
    return this.projectsService.create(createProjectDto, currentUserId);
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  @Get()
  findAll(
    @Query() queryDto: ProjectQueryDto,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') currentUserRole: UserRole,
  ) {
    return this.projectsService.findAll(
      queryDto,
      currentUserId,
      currentUserRole,
    );
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') currentUserRole: UserRole,
  ) {
    return this.projectsService.findOne(id, currentUserId, currentUserRole);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.projectsService.update(id, dto, currentUserId, role);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.projectsService.remove(id, currentUserId, role);
  }
}
