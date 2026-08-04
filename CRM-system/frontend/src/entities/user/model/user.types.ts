export type UserRole = "ADMIN" | "MANAGER" | "WORKER";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UsersResponse = {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
};

export type UpdateUserStatusData = {
  isActive: boolean;
};