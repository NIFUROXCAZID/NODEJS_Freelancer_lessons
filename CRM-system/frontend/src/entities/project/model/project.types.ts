export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ProjectStatus = "ACTIVE" | "COMPLETED";

export type ProjectUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  desiredDeadline: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  manager?: ProjectUser | null;
  createdBy?: ProjectUser | null;
};

export type CreateProjectData = {
  title: string;
  description: string;
  priority: ProjectPriority;
  desiredDeadline: string;
  managerId: number;
};

export type UpdateProjectData = {
  title?: string;
  description?: string;
  priority?: ProjectPriority;
  desiredDeadline?: string;
  managerId?: number;
};