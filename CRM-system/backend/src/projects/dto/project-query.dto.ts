import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsBoolean,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ProjectSortBy } from '../enums/project-sort-by.enum';
import { SortOrder } from '../../tasks/enums/sort-order.enum';
import { ProjectPriority } from '../enums/project-priority.enum';
import { ProjectStatus } from '../enums/project-status.enum';

export class ProjectQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  all?: boolean = false;

  @IsOptional()
  @IsEnum(ProjectSortBy)
  sortBy: ProjectSortBy = ProjectSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  managerId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
