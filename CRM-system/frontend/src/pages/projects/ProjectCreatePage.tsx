import { useEffect, useState, type FormEventHandler } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";
import type { User} from "../../entities/user/model/user.types";
import type { CreateProjectData, ProjectPriority } from "../../entities/project/model/project.types";
import {
  PROJECT_PRIORITY_LABELS,
  PROJECT_PRIORITIES,
} from "../../entities/project/model/project.constants";

import type { PaginatedResponse } from "../../shared/types/pagination.types";

export function ProjectCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<ProjectPriority>("MEDIUM");

  const [desiredDeadline, setDesiredDeadline] = useState("");

  const [managerId, setManagerId] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [managers, setManagers] = useState<User[]>([]);

  const [isManagersLoading, setIsManagersLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      return;
    }

    const loadManagers = async () => {
      try {
        setError("");
        setIsManagersLoading(true);

        const response = await api.get<PaginatedResponse<User>>("/users", {
          params: {
            all: true,
            role: "MANAGER",
            status: "ACTIVE",
          },
        });

        setManagers(response.data.data);
      } catch (error) {
        console.error("Не вдалося завантажити менеджерів", error);

        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;

          if (Array.isArray(message)) {
            setError(message.join(", "));
          } else if (typeof message === "string") {
            setError(message);
          } else {
            setError("Не вдалося завантажити список менеджерів");
          }
        } else {
          setError("Сталася невідома помилка");
        }
      } finally {
        setIsManagersLoading(false);
      }
    };

    void loadManagers();
  }, [user?.role]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const canCreateProject = user.role === "ADMIN" || user.role === "MANAGER";

  if (!canCreateProject) {
    return (
      <section>
        <h2>Створення проєкту</h2>
        <p>У вас немає прав для створення проєктів.</p>
      </section>
    );
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const selectedManagerId = user.role === "MANAGER" ? user.id : Number(managerId);

    if (user.role === "ADMIN" && (!selectedManagerId || Number.isNaN(selectedManagerId))) {
      setError("Оберіть менеджера");
      return;
    }

    if (title.trim().length < 2) {
      setError("Назва повинна містити щонайменше 2 символи");
      return;
    }

    if (description.trim().length < 5) {
      setError("Опис повинен містити щонайменше 5 символів");
      return;
    }

    if (!desiredDeadline) {
      setError("Оберіть бажаний дедлайн");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const projectData: CreateProjectData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        desiredDeadline,
        managerId: selectedManagerId,
      };

      const response = await api.post<{ id: number }>("/projects", projectData);

      navigate(`/projects/${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(", "));
        } else if (typeof message === "string") {
          setError(message);
        } else {
          setError("Не вдалося створити проєкт");
        }
      } else {
        setError("Сталася невідома помилка");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleId = "titleId";
  const descriptionId = "descriptionId";
  const priorityId = "priorityId";
  const managerInputId = "managerInputId";
  const deadlineId = "deadlineId";

  return (
    <section style={{ textAlign: "center" }}>
      <h2>Створити проєкт</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to="/projects">
          <span>Назад до проєктів</span>
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
            <select className="defaultForm__select" style={{ maxWidth: "350px" }} id={priorityId} value={priority} onChange={(event) => setPriority(event.target.value as ProjectPriority)}>
              {PROJECT_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PROJECT_PRIORITY_LABELS[priority]}
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
              style={{ maxWidth: "350px" }}
              id={deadlineId}
              type="date"
              value={desiredDeadline}
              onChange={(event) => setDesiredDeadline(event.target.value)}
              required
            />
          </div>
          {user.role === "ADMIN" && (
            <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
              <label className="defaultForm__label" htmlFor={managerInputId}>
                Менеджер
              </label>
              <select
                className="defaultForm__select"
                style={{ maxWidth: "350px" }}
                id={managerInputId}
                value={managerId}
                onChange={(event) => setManagerId(event.target.value)}
                disabled={isManagersLoading}
                required
              >
                <option value="">{isManagersLoading ? "Завантаження менеджерів..." : "Оберіть менеджера"}</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={String(manager.id)}>
                    {manager.firstName} {manager.lastName}
                    {" — "}
                    {manager.email}
                  </option>
                ))}
              </select>
            </div>
          )}
          {user.role === "MANAGER" && <p>Менеджером проєкту буде призначено вас.</p>}
          {error && <p role="alert">{error}</p>}
          <div className="defaultForm__btn-wrap">
            <button className="defaultButton" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Створення..." : "Створити проєкт"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
