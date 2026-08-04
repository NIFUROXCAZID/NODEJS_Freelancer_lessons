import { createBrowserRouter, Navigate } from "react-router-dom";

import { ADMIN_ONLY_ROLES, MANAGER_AND_ADMIN_ROLES } from "../../entities/user/model/user.constants";

import { ProtectedRoute } from "../../features/auth/ui/ProtectedRoute";
import { LoginPage } from "../../pages/login/LoginPage";
import { DashboardPage } from "../../pages/dashboard/DashboardPage";

import { MainLayout } from "../../widgets/MainLayout/MainLayout";
import { ProjectsPage } from "../../pages/projects/ProjectsPage";
import { TasksPage } from "../../pages/tasks/TasksPage";

import { ProjectDetailsPage } from "../../pages/projects/ProjectDetailsPage";
import { TaskDetailsPage } from "../../pages/tasks/TaskDetailsPage";
import { ProjectCreatePage } from "../../pages/projects/ProjectCreatePage";
import { ProjectEditPage } from "../../pages/projects/ProjectEditPage";
import { TaskCreatePage } from "../../pages/tasks/TaskCreatePage";
import { TaskEditPage } from "../../pages/tasks/TaskEditPage";
import { UsersPage } from "../../pages/users/UsersPage";
import { UserCreatePage } from "../../pages/users/UserCreatePage";
import { UserEditPage } from "../../pages/users/UserEditPage";
import { NotFoundPage } from "../../pages/error-pages/NotFoundPage";
import { ForbiddenPage } from "../../pages/error-pages/ForbiddenPage";
import { RoleRoute } from "../../features/auth/ui/RoleRoute";
import { AboutPage } from "../../pages/about/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/projects",
            element: <ProjectsPage />,
          },
          {
            path: "/projects/:id",
            element: <ProjectDetailsPage />,
          },
          {
            path: "/tasks",
            element: <TasksPage />,
          },
          {
            path: "/tasks/:id",
            element: <TaskDetailsPage />,
          },
          {
            element: <RoleRoute allowedRoles={MANAGER_AND_ADMIN_ROLES} />,
            children: [
              {
                path: "/projects/create",
                element: <ProjectCreatePage />,
              },
              {
                path: "/projects/:id/edit",
                element: <ProjectEditPage />,
              },
              {
                path: "/tasks/create",
                element: <TaskCreatePage />,
              },
              {
                path: "/tasks/:id/edit",
                element: <TaskEditPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={ADMIN_ONLY_ROLES} />,
            children: [
              {
                path: "/users",
                element: <UsersPage />,
              },
              {
                path: "/users/create",
                element: <UserCreatePage />,
              },
              {
                path: "/users/:id/edit",
                element: <UserEditPage />,
              },
            ],
          },
          {
            path: "/about",
            element: <AboutPage />,
          },
          {
            path: "/forbidden",
            element: <ForbiddenPage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
