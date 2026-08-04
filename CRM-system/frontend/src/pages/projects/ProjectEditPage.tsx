import { useEffect, useState, type FormEventHandler } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";
import type { PaginatedResponse } from "../../shared/types/pagination.types";

import type { Project, ProjectPriority, UpdateProjectData } from "../../entities/project/model/project.types";
import {
  PROJECT_PRIORITY_LABELS,
  PROJECT_PRIORITIES,
} from "../../entities/project/model/project.constants";

import type { User } from "../../entities/user/model/user.types";

export function ProjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);

  const [managers, setManagers] = useState<User[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<ProjectPriority>("MEDIUM");

  const [desiredDeadline, setDesiredDeadline] = useState("");

  const [managerId, setManagerId] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const canEditProject = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError("ID проєкту не передано");
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        setIsLoading(true);

        const response = await api.get<Project>(`/projects/${id}`);

        const loadedProject = response.data;

        setProject(loadedProject);
        setTitle(loadedProject.title);
        setDescription(loadedProject.description);
        setPriority(loadedProject.priority);
        setDesiredDeadline(loadedProject.desiredDeadline.slice(0, 10));
        setManagerId(loadedProject.manager ? String(loadedProject.manager.id) : "");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;

          setError(typeof message === "string" ? message : "Не вдалося завантажити проєкт");
        } else {
          setError("Сталася невідома помилка");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadProject();
  }, [id]);

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      return;
    }

    const loadManagers = async () => {
      try {
        const response = await api.get<PaginatedResponse<User>>("/users", {
          params: {
            all: true,
            role: "MANAGER",
            status: "ACTIVE",
          },
        });

        setManagers(response.data.data);
      } catch (error) {
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
      }
    };

    void loadManagers();
  }, [user?.role]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canEditProject) {
    return (
      <section>
        <h2>Редагування проєкту</h2>

        <p>У вас немає прав для редагування проєктів.</p>

        <Link to="/projects">Повернутися до проєктів</Link>
      </section>
    );
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!id) {
      return;
    }

    let selectedManagerId: number | undefined;

    if (user.role === "ADMIN") {
      selectedManagerId = Number(managerId);

      if (!selectedManagerId || Number.isNaN(selectedManagerId)) {
        setError("Оберіть менеджера");
        return;
      }
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
      const updateData: UpdateProjectData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        desiredDeadline,
      };

      if (selectedManagerId !== undefined) {
        updateData.managerId = selectedManagerId;
      }

      await api.patch(`/projects/${id}`, updateData);

      navigate(`/projects/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("UPDATE PROJECT ERROR:", error.response?.data);

        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(", "));
        } else if (typeof message === "string") {
          setError(message);
        } else {
          setError("Не вдалося оновити проєкт");
        }
      } else {
        setError("Сталася невідома помилка");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <section><p>Завантаження проєкту...</p></section>;
  }

  if (error && !project) {
    return (
      <section>
        <p role="alert">{error}</p>
        <div className="centerBtn">
          <Link className="defaultButton" to="/projects">
            <span>Повернутися до проєктів</span>
          </Link>
        </div>
      </section>
    );
  }

  if (!project) {
    return <section><p>Проєкт не знайдено.</p></section>;
  }

  const titleId = "titleId";
  const descriptionId = "descriptionId";
  const priorityId = "priorityId";
  const managerInputId = "managerInputId";
  const deadlineId = "deadlineId";

  return (
    <section style={{ textAlign: "center" }}>
      <h2>Редагувати проєкт</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to={`/projects/${project.id}`}>
          Назад до проєкту
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
              id={deadlineId}
              style={{ maxWidth: "350px" }}
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
              <select className="defaultForm__select" style={{ maxWidth: "100%" }} id={managerInputId} value={managerId} onChange={(event) => setManagerId(event.target.value)} required>
                <option value="">Оберіть менеджера</option>
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
          {user.role === "MANAGER" && <p>Менеджера проєкту змінювати не можна.</p>}
          {error && <p role="alert">{error}</p>}
          <div className="defaultForm__btn-wrap">
            <button className="defaultButton" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
