import type { TaskPriority, TaskStatus } from "./task.types";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "Чекає на виконання",
  IN_PROGRESS: "У роботі",
  IN_REVIEW: "На перевірці",
  DONE: "Виконано",
};

export const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

export const WORKER_TASK_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  TODO: ["IN_PROGRESS"],
  IN_PROGRESS: ["TODO", "IN_REVIEW"],
  IN_REVIEW: ["IN_PROGRESS"],
  DONE: [],
};

export const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Низький",
  MEDIUM: "Середній",
  HIGH: "Високий",
  CRITICAL: "Критичний",
};