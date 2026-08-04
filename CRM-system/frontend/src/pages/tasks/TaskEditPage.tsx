import { useEffect, useState, type FormEventHandler } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";

import type { Task, TaskPriority, UpdateTaskData } from "../../entities/task/model/task.types";

import type { Project } from "../../entities/project/model/project.types";
import type { User } from "../../entities/user/model/user.types";
import type { PaginatedResponse } from "../../shared/types/pagination.types";
import { TASK_PRIORITIES, TASK_PRIORITY_LABELS } from "../../entities/task/model/task.constants";

export function TaskEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState<Task | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  const [desiredDeadline, setDesiredDeadline] = useState("");

  const [projectId, setProjectId] = useState("");
  const [assignedWorkerId, setAssignedWorkerId] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const canEditTask = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    if (!id || !canEditTask) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setError("");
        setIsLoading(true);

        const [taskResponse, projectsResponse, workersResponse] = await Promise.all([
          api.get<Task>(`/tasks/${id}`),

          api.get<PaginatedResponse<Project>>("/projects", {
            params: {
              all: true,
            },
          }),

          api.get<User[]>("/users/workers/active"),
        ]);

        const loadedTask = taskResponse.data;

        setTask(loadedTask);

        setTitle(loadedTask.title);
        setDescription(loadedTask.description);
        setPriority(loadedTask.priority);

        setDesiredDeadline(loadedTask.desiredDeadline.slice(0, 10));

        setProjectId(loadedTask.project ? String(loadedTask.project.id) : "");

        setAssignedWorkerId(loadedTask.assignedWorker ? String(loadedTask.assignedWorker.id) : "");

        setProjects(projectsResponse.data.data);

        setWorkers(workersResponse.data);
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

    void loadData();
  }, [id, canEditTask]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canEditTask) {
    return (
      <section>
        <h2>Редагування задачі</h2>
        <p>У вас немає прав для редагування задач.</p>
        <Link to="/tasks">Повернутися до задач</Link>
      </section>
    );
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!id) {
      return;
    }

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
      const updateData: UpdateTaskData = {
        title,
        description,
        priority,
        desiredDeadline,
        projectId: selectedProjectId,
        assignedWorkerId: selectedWorkerId,
      };

      await api.patch(`/tasks/${id}`, updateData);

      navigate(`/tasks/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("UPDATE TASK ERROR:", error.response?.data);

        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(", "));
        } else if (typeof message === "string") {
          setError(message);
        } else {
          setError("Не вдалося оновити задачу");
        }
      } else {
        setError("Сталася невідома помилка");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <section><p>Завантаження задачі...</p></section>;
  }

  if (error && !task) {
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

  const titleId = "titleId";
  const descriptionId = "descriptionId";
  const priorityId = "priorityId";
  const projectInputId = "projectInputId";
  const workerId = "workerId";
  const deadlineId = "deadlineId";

  return (
    <section style={{ textAlign: "center" }}>
      <h2>Редагувати задачу</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to={`/tasks/${task.id}`}>
          Назад до задачі
        </Link>
      </div>

      <div className="defaultForm">
        <form className="defaultForm__form defaultForm--center" onSubmit={handleSubmit}>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={titleId}>
              Назва
            </label>
            <input className="defaultForm__fieldInput" style={{ maxWidth: "100%" }} id={titleId} type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={descriptionId}>
              Опис задачі
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
                <option key={project.id} value={project.id}>
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
              <span>{isSubmitting ? "Збереження..." : "Зберегти зміни"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
