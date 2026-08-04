import type { UserRole } from "./user.types";

export const ADMIN_ONLY_ROLES: UserRole[] = ["ADMIN"];

export const MANAGER_AND_ADMIN_ROLES: UserRole[] = ["ADMIN", "MANAGER"];

export const ALL_USER_ROLES: UserRole[] = ["ADMIN", "MANAGER", "WORKER"];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Адміністратор",
  MANAGER: "Менеджер",
  WORKER: "Робітник",
};
