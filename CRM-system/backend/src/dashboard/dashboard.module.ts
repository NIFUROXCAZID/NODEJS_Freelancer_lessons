import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, Project, Task])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
