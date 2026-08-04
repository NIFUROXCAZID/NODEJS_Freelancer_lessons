import { IsEnum } from 'class-validator';

import { ProjectStatus } from '../enums/project-status.enum';

export class UpdateProjectStatusDto {
  @IsEnum(ProjectStatus)
  status!: ProjectStatus;
}
