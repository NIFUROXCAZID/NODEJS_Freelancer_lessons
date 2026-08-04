import type { ProjectPriority, ProjectStatus } from "./project.types";

export const PROJECT_PRIORITIES: ProjectPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  LOW: "Низький",
  MEDIUM: "Середній",
  HIGH: "Високий",
  CRITICAL: "Критичний",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  ACTIVE: "Активний",
  COMPLETED: "Завершений",
};
