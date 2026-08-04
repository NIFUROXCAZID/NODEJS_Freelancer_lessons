import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  getAdminStatistics() {
    return this.dashboardService.getAdminStatistics();
  }

  @Get('me')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  getPersonalStatistics(
    @CurrentUser('sub') currentUserId: number,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.dashboardService.getPersonalStatistics(currentUserId, role);
  }
}
