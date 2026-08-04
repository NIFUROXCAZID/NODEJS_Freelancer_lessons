import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";

import type { Task, TaskPriority, TaskStatus } from "../../entities/task/model/task.types";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "../../entities/task/model/task.constants";

import type { PaginatedResponse } from "../../shared/types/pagination.types";

type PageSize = 10 | 30 | "ALL";

export function TasksPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState<"ALL" | TaskStatus>("ALL");

  const [priorityFilter, setPriorityFilter] = useState<"ALL" | TaskPriority>("ALL");

  const canCreateTask = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    const loadTasks = async () => {
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

        const response = await api.get<PaginatedResponse<Task>>("/tasks", {
          params,
        });

        setTasks(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;

          if (Array.isArray(message)) {
            setError(message.join(", "));
          } else if (typeof message === "string") {
            setError(message);
          } else {
            setError("Не вдалося завантажити задачі");
          }
        } else {
          setError("Сталася невідома помилка");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadTasks();
  }, [page, pageSize, search, statusFilter, priorityFilter]);

  if (error) {
    return (
      <section>
        <h2>Задачі</h2>
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
      <h2>Задачі</h2>
      {canCreateTask && (
        <div className="centerBtn">
          <Link className="defaultButton" to="/tasks/create">
            <span>Створити задачу</span>
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
            placeholder="Назва або опис задачі"
          />
        </div>
        <div className="selectWrap">
          <p>Роль</p>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "220px" }}
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as "ALL" | TaskStatus);
              setPage(1);
            }}
          >
            <option value="ALL">Усі статуси</option>
            <option value="TODO">Чекає на виконання</option>
            <option value="IN_PROGRESS">У роботі</option>
            <option value="IN_REVIEW">На перевірці</option>
            <option value="DONE">Виконано</option>
          </select>
        </div>
        <div className="selectWrap">
          <p>Стан</p>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "220px" }}
            value={priorityFilter}
            onChange={(event) => {
              setPriorityFilter(event.target.value as "ALL" | TaskPriority);
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
        <nav className="pagination" aria-label="Пагінація задач">
          <button className="pagination__btn" type="button" onClick={() => setPage((currentPage) => currentPage - 1)} disabled={page === 1}>
            <span>Попередня</span>
          </button>

          <strong>
            Сторінка {page} з {totalPages}
          </strong>

          <button className="pagination__btn" type="button" onClick={() => setPage((currentPage) => currentPage + 1)} disabled={page === totalPages}>
            <span>Наступна</span>
          </button>
        </nav>
      )}

      {isLoading && <p>Завантаження...</p>}
      {!isLoading && tasks.length === 0 && !hasActiveFilters && <p>Задач поки немає.</p>}
      {!isLoading && tasks.length === 0 && hasActiveFilters && <p>За вказаними фільтрами задач не знайдено.</p>}
      {!isLoading && tasks.length > 0 && (
        <>
          <h3>
            Знайдено задач: <strong>{total}</strong>
          </h3>
          <p>
            Показано на цій сторінці: <strong>{tasks.length}</strong>
          </p>
          <figure>
            <table className="dataTable">
              <tbody>
                <tr>
                  <td>
                    <strong>Назва задачі</strong>
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
                    <strong>Проєкт</strong>
                  </td>
                  <td>
                    <strong>Виконавець</strong>
                  </td>
                </tr>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div style={{ textAlign: "center" }}>
                        <Link className="tableTitle" to={`/tasks/${task.id}`}>
                          {task.title}
                        </Link>
                      </div>
                    </td>
                    <td>
                      <p className="tableText">{task.description}</p>
                    </td>
                    <td>
                      <p>{TASK_PRIORITY_LABELS[task.priority]}</p>
                    </td>
                    <td className="tableSmallCol">
                      <p>{TASK_STATUS_LABELS[task.status]}</p>
                    </td>
                    <td>
                      <p>{new Date(task.desiredDeadline).toLocaleDateString("uk-UA")}</p>
                    </td>
                    <td>
                      {task.project && (
                        <div style={{ textAlign: "center" }} className="tableText">
                          <Link className="tableTitle" to={`/projects/${task.project.id}`}>
                            {task.project.title}
                          </Link>
                        </div>
                      )}
                    </td>
                    <td>
                      {task.assignedWorker && (
                        <p>
                          {task.assignedWorker.firstName} {task.assignedWorker.lastName}
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
