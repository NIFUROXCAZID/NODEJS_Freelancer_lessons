import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import type { Task, TaskStatus } from "../../entities/task/model/task.types";
import { useAuth } from "../../features/auth/model/AuthContext";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  WORKER_TASK_STATUS_TRANSITIONS,
} from "../../entities/task/model/task.constants";


export function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [statusError, setStatusError] = useState("");

  const { user } = useAuth();

  const canManageTask = user?.role === "ADMIN" || user?.role === "MANAGER";

  const canDeleteTask = canManageTask;
  const canEditTask = canManageTask;

  const canChangeStatus = canManageTask || (user?.role === "WORKER" && task?.assignedWorker?.id === user.id);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) {
        setError("ID задачі не передано");
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        setIsLoading(true);

        const response = await api.get<Task>(`/tasks/${id}`);

        setTask(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;

          setError(typeof message === "string" ? message : "Не вдалося завантажити задачу");
        } else {
          setError("Сталася невідома помилка");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadTask();
  }, [id]);

  const handleDelete = async () => {
    if (!task) {
      return;
    }

    const confirmed = window.confirm(`Видалити задачу "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);

      await api.delete(`/tasks/${task.id}`);

      navigate("/tasks");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setDeleteError(typeof message === "string" ? message : "Не вдалося видалити задачу");
      } else {
        setDeleteError("Сталася невідома помилка");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) {
      return;
    }

    try {
      setStatusError("");
      setIsUpdatingStatus(true);

      const response = await api.patch<Task>(`/tasks/${task.id}/status`, {
        status: newStatus,
      });

      setTask(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("UPDATE TASK STATUS ERROR:", error.response?.data);

        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setStatusError(message.join(", "));
        } else if (typeof message === "string") {
          setStatusError(message);
        } else {
          setStatusError("Не вдалося змінити статус задачі");
        }
      } else {
        setStatusError("Сталася невідома помилка");
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getAvailableStatuses = (): TaskStatus[] => {
    if (!task || !user) {
      return [];
    }

    if (user.role === "ADMIN" || user.role === "MANAGER") {
      return TASK_STATUSES;
    }

    if (user.role === "WORKER" && task.assignedWorker?.id === user.id) {
      return WORKER_TASK_STATUS_TRANSITIONS[task.status];
    }

    return [];
  };
  const availableStatuses = getAvailableStatuses();

  if (isLoading) {
    return <section><p>Завантаження задачі...</p></section>;
  }
  if (error) {
    return (
      <section>
        <p role="alert">{error}</p>
        <div className="centerBtn">
          <Link className="defaultButton" to="/tasks">
            <span>Повернутися до задач</span>
          </Link>
        </div>
      </section>
    );
  }
  if (!task) {
    return <section><p>Задачу не знайдено.</p></section>;
  }

  const statusOptions = Array.from(new Set([task.status, ...availableStatuses]));

  return (
    <section>
      <h2>{task.title}</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to="/tasks">
          <span>Назад до задач</span>
        </Link>
        {canEditTask && (
          <Link className="defaultButton" to={`/tasks/${task.id}/edit`}>
            <span>Редагувати задачу</span>
          </Link>
        )}
        {canDeleteTask && (
          <button className="defaultButton" type="button" onClick={() => void handleDelete()} disabled={isDeleting}>
            <span>{isDeleting ? "Видалення..." : "Видалити задачу"}</span>
          </button>
        )}
      </div>
      <p>Опис задачі: {task.description}</p>
      <p>
        Пріоритет: <strong>{TASK_PRIORITY_LABELS[task.priority]}</strong>
      </p>
      <p>
        Статус: <strong>{TASK_STATUS_LABELS[task.status]}</strong>
      </p>
      {canChangeStatus && availableStatuses.length > 0 && (
        <div className="selectWrap" style={{ justifyContent: "flex-start", marginBottom: "20px" }}>
          <p>Змінити статус</p>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "300px" }}
            value={task.status}
            onChange={(event) => {
              const newStatus = event.target.value as TaskStatus;

              if (newStatus !== task.status) {
                void handleStatusChange(newStatus);
              }
            }}
            disabled={isUpdatingStatus}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      )}
      {statusError && <p role="alert">{statusError}</p>}
      <p>
        Дедлайн: <strong>{new Date(task.desiredDeadline).toLocaleDateString("uk-UA")}</strong>
      </p>
      <p>
        Завершено: <strong>{task.completedAt ?? "Ні"}</strong>
      </p>
      {task.project && (
        <p>
          Проєкт:{" "}
          <strong>
            <Link className="tableTitle" to={`/projects/${task.project.id}`}>
              <span>{task.project.title}</span>
            </Link>
          </strong>
        </p>
      )}
      {task.assignedWorker && (
        <p>
          Виконавець:{" "}
          <strong>
            {task.assignedWorker.firstName} {task.assignedWorker.lastName}
          </strong>
        </p>
      )}
      {task.createdBy && (
        <p>
          Створив:{" "}
          <strong>
            {task.createdBy.firstName} {task.createdBy.lastName}
          </strong>
        </p>
      )}
    </section>
  );
}
