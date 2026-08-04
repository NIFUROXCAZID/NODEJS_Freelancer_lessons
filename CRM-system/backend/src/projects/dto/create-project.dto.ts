import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

import { ProjectPriority } from '../enums/project-priority.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ProjectPriority)
  priority: ProjectPriority;

  @IsDateString()
  desiredDeadline: string;

  @IsInt()
  @Min(1)
  managerId: number;
}
