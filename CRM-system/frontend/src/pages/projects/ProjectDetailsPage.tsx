import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import type { Project } from "../../entities/project/model/project.types";
import { useAuth } from "../../features/auth/model/AuthContext";
import { PROJECT_PRIORITY_LABELS, PROJECT_STATUS_LABELS } from "../../entities/project/model/project.constants";

export function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  const { user } = useAuth();

  const canDeleteProject = user?.role === "ADMIN" || user?.role === "MANAGER";
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

        setProject(response.data);
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

  const handleDelete = async () => {
    if (!project) {
      return;
    }

    const confirmed = window.confirm(`Видалити проєкт "${project.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);

      await api.delete(`/projects/${project.id}`);

      navigate("/projects");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setDeleteError(typeof message === "string" ? message : "Не вдалося видалити проєкт");
      } else {
        setDeleteError("Сталася невідома помилка");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <section><p>Завантаження проєкту...</p></section>;
  }
  if (error) {
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

  return (
    <section>
      <h2>{project.title}</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to="/projects">
          <span>Назад до проєктів</span>
        </Link>
        {canEditProject && (
          <Link className="defaultButton" to={`/projects/${project.id}/edit`}>
            <span>Редагувати проєкт</span>
          </Link>
        )}
        {canDeleteProject && (
          <button className="defaultButton" type="button" onClick={() => void handleDelete()} disabled={isDeleting}>
            <span>{isDeleting ? "Видалення..." : "Видалити проєкт"}</span>
          </button>
        )}
      </div>
      {deleteError && <p role="alert">{deleteError}</p>}
      <p>Опис проєкту: {project.description}</p>
      <p>
        Пріоритет: <strong>{PROJECT_PRIORITY_LABELS[project.priority]}</strong>
      </p>
      <p>
        Статус: <strong>{PROJECT_STATUS_LABELS[project.status]}</strong>
      </p>
      <p>
        Бажаний дедлайн: <strong>{project.desiredDeadline}</strong>
      </p>
      <p>
        Завершено: <strong>{project.completedAt ?? "Ні"}</strong>
      </p>
      {project.manager && (
        <p>
          Менеджер:{" "}
          <strong>
            {project.manager.firstName} {project.manager.lastName}
          </strong>
        </p>
      )}
      {project.createdBy && (
        <p>
          Створив:{" "}
          <strong>
            {project.createdBy.firstName} {project.createdBy.lastName}
          </strong>
        </p>
      )}
    </section>
  );
}
