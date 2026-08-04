import type { ProjectUser } from "../../project/model/project.types";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type TaskProject = {
  id: number;
  title: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  desiredDeadline: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;

  project?: TaskProject;
  assignedWorker?: ProjectUser | null;
  createdBy?: ProjectUser | null;
};

export type CreateTaskData = {
  title: string;
  description: string;
  priority: TaskPriority;
  desiredDeadline: string;
  projectId: number;
  assignedWorkerId: number;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  desiredDeadline?: string;
  projectId?: number;
  assignedWorkerId?: number;
  status?: TaskStatus;
};