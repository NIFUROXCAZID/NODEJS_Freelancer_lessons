import { useEffect, useState, type FormEventHandler } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";

import type { CreateTaskData, TaskPriority } from "../../entities/task/model/task.types";

import type { Project } from "../../entities/project/model/project.types";
import type { User } from "../../entities/user/model/user.types";
import type { PaginatedResponse } from "../../shared/types/pagination.types";
import { TASK_PRIORITIES, TASK_PRIORITY_LABELS } from "../../entities/task/model/task.constants";

export function TaskCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  const [desiredDeadline, setDesiredDeadline] = useState("");

  const [projectId, setProjectId] = useState("");
  const [assignedWorkerId, setAssignedWorkerId] = useState("");

  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const canCreateTask = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    if (!canCreateTask) {
      setIsLoadingOptions(false);
      return;
    }

    const loadOptions = async () => {
      try {
        setError("");
        setIsLoadingOptions(true);

        const [projectsResponse, workersResponse] = await Promise.all([
          api.get<PaginatedResponse<Project>>("/projects", {
            params: {
              all: true,
            },
          }),

          api.get<User[]>("/users/workers/active"),
        ]);

        setProjects(projectsResponse.data.data);
        setWorkers(workersResponse.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;

          if (Array.isArray(message)) {
            setError(message.join(", "));
          } else if (typeof message === "string") {
            setError(message);
          } else {
            setError("Не вдалося завантажити проєкти або робітників");
          }
        } else {
          setError("Сталася невідома помилка");
        }
      } finally {
        setIsLoadingOptions(false);
      }
    };

    void loadOptions();
  }, [canCreateTask]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canCreateTask) {
    return (
      <section>
        <h2>Створення задачі</h2>
        <p>У вас немає прав для створення задач.</p>
        <div className="centerBtn">
          <Link className="defaultButton" to="/tasks">
            <span>Повернутися до задач</span>
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const selectedProjectId = Number(projectId);
    const selectedWorkerId = Number(assignedWorkerId);

    if (!selectedProjectId || Number.isNaN(selectedProjectId)) {
      setError("Оберіть проєкт");
      return;
    }

    if (!selectedWorkerId || Number.isNaN(selectedWorkerId)) {
      setError("Оберіть виконавця");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const taskData: CreateTaskData = {
        title,
        description,
        priority,
        desiredDeadline,
        projectId: selectedProjectId,
        assignedWorkerId: selectedWorkerId,
      };

      const response = await api.post<{
        id: number;
      }>("/tasks", taskData);

      navigate(`/tasks/${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(", "));
        } else if (typeof message === "string") {
          setError(message);
        } else {
          setError("Не вдалося створити задачу");
        }
      } else {
        setError("Сталася невідома помилка");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOptions) {
    return <section><p>Завантаження даних форми...</p></section>;
  }

  const titleId = "titleId";
  const descriptionId = "descriptionId";
  const priorityId = "priorityId";
  const projectInputId = "projectInputId";
  const workerId = "workerId";
  const deadlineId = "deadlineId";

  return (
    <section style={{ textAlign: "center" }}>
      <h2>Створити задачу</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to="/tasks">
          <span>Назад до задач</span>
        </Link>
      </div>
      <div className="defaultForm">
        <form className="defaultForm__form" onSubmit={handleSubmit}>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={titleId}>
              Назва
            </label>
            <input className="defaultForm__fieldInput" style={{ maxWidth: "100%" }} id={titleId} type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={descriptionId}>
              Опис
            </label>
            <textarea className="defaultForm__fieldInput" style={{ maxWidth: "100%" }} id={descriptionId} value={description} onChange={(event) => setDescription(event.target.value)} required />
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={priorityId}>
              Пріоритет
            </label>
            <select className="defaultForm__select" style={{ maxWidth: "350px" }} id={priorityId} value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {TASK_PRIORITY_LABELS[priority]}
                </option>
              ))}
            </select>
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={projectInputId}>
              Проєкт
            </label>
            <select className="defaultForm__select" style={{ maxWidth: "100%" }} id={projectInputId} value={projectId} onChange={(event) => setProjectId(event.target.value)} required>
              <option value="">Оберіть проєкт</option>
              {projects.map((project) => (
                <option key={project.id} value={String(project.id)}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={workerId}>
              Виконавець
            </label>
            <select className="defaultForm__select" style={{ maxWidth: "100%" }} id={workerId} value={assignedWorkerId} onChange={(event) => setAssignedWorkerId(event.target.value)} required>
              <option value="">Оберіть робітника</option>
              {workers.map((worker) => (
                <option key={worker.id} value={String(worker.id)}>
                  {worker.firstName} {worker.lastName}
                  {" — "}
                  {worker.email}
                </option>
              ))}
            </select>
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={deadlineId}>
              Бажаний дедлайн
            </label>
            <input
              className="defaultForm__fieldInput"
              id={deadlineId}
              style={{ maxWidth: "350px" }}
              type="date"
              value={desiredDeadline}
              onChange={(event) => setDesiredDeadline(event.target.value)}
              required
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <div className="defaultForm__btn-wrap">
            <button className="defaultButton" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? "Створення..." : "Створити задачу"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
