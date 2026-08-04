import { useEffect, useState } from "react";
import axios from "axios";

import { api } from "../../shared/api/axiosInstance";
import type { Project, ProjectPriority, ProjectStatus } from "../../entities/project/model/project.types";
import type { PaginatedResponse } from "../../shared/types/pagination.types";
import { useAuth } from "../../features/auth/model/AuthContext";

import { PROJECT_PRIORITY_LABELS, PROJECT_STATUS_LABELS } from "../../entities/project/model/project.constants";

import { Link } from "react-router-dom";
type PageSize = 10 | 30 | "ALL";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState<"ALL" | ProjectStatus>("ALL");

  const [priorityFilter, setPriorityFilter] = useState<"ALL" | ProjectPriority>("ALL");

  const { user } = useAuth();

  const canCreateProject = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setError("");
        setIsLoading(true);

        const params = {
          ...(pageSize === "ALL"
            ? {
                all: true,
              }
            : {
                page,
                limit: pageSize,
              }),

          ...(search.trim() && {
            search: search.trim(),
          }),

          ...(statusFilter !== "ALL" && {
            status: statusFilter,
          }),

          ...(priorityFilter !== "ALL" && {
            priority: priorityFilter,
          }),
        };

        const response = await api.get<PaginatedResponse<Project>>("/projects", {
          params,
        });

        setProjects(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;

          setError(typeof message === "string" ? message : "Не вдалося завантажити проєкти");
        } else {
          setError("Сталася невідома помилка");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadProjects();
  }, [page, pageSize, search, statusFilter, priorityFilter]);

  if (error) {
    return (
      <section>
        <h2>Проєкти</h2>
        <p role="alert">{error}</p>
      </section>
    );
  }

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setPage(1);
  };

  const hasActiveFilters = search.trim() !== "" || statusFilter !== "ALL" || priorityFilter !== "ALL";

  return (
    <section>
      <h2>Проєкти</h2>
      {canCreateProject && (
        <div className="centerBtn">
          <Link className="defaultButton" to="/projects/create">
            <span>Створити проєкт</span>
          </Link>
        </div>
      )}
      <div className="sort">
        <div className="sort__inputWrap">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Назва або опис проєкту"
          />
        </div>
        <div className="selectWrap">
          <p>Статус</p>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "220px" }}
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as "ALL" | ProjectStatus);
              setPage(1);
            }}
          >
            <option value="ALL">Усі статуси</option>
            <option value="ACTIVE">Активний</option>
            <option value="COMPLETED">Завершений</option>
          </select>
        </div>
        <div className="selectWrap">
          <p>Пріорітет</p>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "220px" }}
            value={priorityFilter}
            onChange={(event) => {
              setPriorityFilter(event.target.value as "ALL" | ProjectPriority);
              setPage(1);
            }}
          >
            <option value="ALL">Усі пріоритети</option>
            <option value="LOW">Низький</option>
            <option value="MEDIUM">Середній</option>
            <option value="HIGH">Високий</option>
            <option value="CRITICAL">Критичний</option>
          </select>
        </div>
        <button className="defaultButton dropFilter" type="button" onClick={resetFilters}>
          <span>Скинути фільтри</span>
        </button>
      </div>
      <div className="selectWrap">
        <p>Кількість записів</p>
        <select
          className="defaultForm__select"
          style={{ maxWidth: "220px" }}
          value={pageSize}
          onChange={(event) => {
            const value = event.target.value;
            setPageSize(value === "ALL" ? "ALL" : (Number(value) as 10 | 30));
            setPage(1);
          }}
        >
          <option value={10}>Показувати по 10</option>
          <option value={30}>Показувати по 30</option>
          <option value="ALL">Показати всі</option>
        </select>
      </div>
      {pageSize !== "ALL" && totalPages > 1 && (
        <nav className="pagination" aria-label="Пагінація проєктів">
          <button className="pagination__btn" type="button" onClick={() => setPage((currentPage) => currentPage - 1)} disabled={page === 1}>
            Попередня
          </button>
          <strong>
            Сторінка {page} з {totalPages}
          </strong>
          <button className="pagination__btn" type="button" onClick={() => setPage((currentPage) => currentPage + 1)} disabled={page === totalPages}>
            Наступна
          </button>
        </nav>
      )}

      {isLoading && <p>Завантаження...</p>}
      {!isLoading && projects.length === 0 && !hasActiveFilters && <p>Проєктів поки немає.</p>}
      {!isLoading && projects.length === 0 && hasActiveFilters && <p>За вказаними фільтрами проєктів не знайдено.</p>}
      {!isLoading && projects.length > 0 && (
        <>
          <h3>
            Знайдено проєктів: <strong>{total}</strong>
          </h3>
          <p>
            Показано на цій сторінці: <strong>{projects.length}</strong>
          </p>
          <figure>
            <table className="dataTable">
              <tbody>
                <tr>
                  <td>
                    <strong>Назва проєкту</strong>
                  </td>
                  <td>
                    <strong>Короткий опис</strong>
                  </td>
                  <td>
                    <strong>Пріоритет</strong>
                  </td>
                  <td>
                    <strong>Статус</strong>
                  </td>
                  <td>
                    <strong>Дедлайн</strong>
                  </td>
                  <td>
                    <strong>Менеджер</strong>
                  </td>
                </tr>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div style={{ textAlign: "center" }}>
                        <Link className="tableTitle" to={`/projects/${project.id}`}>
                          {project.title}
                        </Link>
                      </div>
                    </td>
                    <td>
                      <p className="tableText">{project.description}</p>
                    </td>
                    <td>
                      <p>{PROJECT_PRIORITY_LABELS[project.priority]}</p>
                    </td>
                    <td className="tableSmallCol">
                      <p>{PROJECT_STATUS_LABELS[project.status]}</p>
                    </td>
                    <td>
                      <p>{new Date(project.desiredDeadline).toLocaleDateString("uk-UA")}</p>
                    </td>
                    <td>
                      {project.manager && (
                        <p>
                          Менеджер: {project.manager.firstName} {project.manager.lastName}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        </>
      )}
    </section>
  );
}
