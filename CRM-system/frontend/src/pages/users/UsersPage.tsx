import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";
import type { PaginatedResponse } from "../../shared/types/pagination.types";

import type { User, UserRole } from "../../entities/user/model/user.types";
import { USER_ROLE_LABELS } from "../../entities/user/model/user.constants";
type PageSize = 10 | 30 | "ALL";
type UserStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export function UsersPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");

  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("ALL");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const loadUsers = async () => {
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

          ...(roleFilter !== "ALL" && {
            role: roleFilter,
          }),

          ...(statusFilter !== "ALL" && {
            status: statusFilter,
          }),
        };

        const response = await api.get<PaginatedResponse<User>>("/users", {
          params,
        });

        setUsers(response.data.data);
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
            setError("Не вдалося завантажити користувачів");
          }
        } else {
          setError("Сталася невідома помилка");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();
  }, [page, pageSize, search, roleFilter, statusFilter]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasActiveFilters = search.trim() !== "" || roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <section>
      <h2>Користувачі</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to="/users/create">
          <span>Створити користувача</span>
        </Link>
      </div>
      <div className="sort">
        <div className="sort__inputWrap">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Ім’я, прізвище або email"
          />
        </div>
        <div className="selectWrap">
          <p>Роль</p>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "220px" }}
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value as "ALL" | UserRole);
              setPage(1);
            }}
          >
            <option value="ALL">Усі ролі</option>
            <option value="ADMIN">Адміністратори</option>
            <option value="MANAGER">Менеджери</option>
            <option value="WORKER">Робітники</option>
          </select>
        </div>
        <div className="selectWrap">
          <p>Стан</p>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "220px" }}
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as UserStatusFilter);
              setPage(1);
            }}
          >
            <option value="ALL">Усі користувачі</option>
            <option value="ACTIVE">Активні</option>
            <option value="INACTIVE">Неактивні</option>
          </select>
        </div>
        <button
          className="defaultButton dropFilter"
          type="button"
          onClick={() => {
            setSearch("");
            setRoleFilter("ALL");
            setStatusFilter("ALL");
            setPage(1);
          }}
        >
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
        <nav className="pagination" aria-label="Пагінація користувачів">
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
      {error && <p role="alert">{error}</p>}
      {isLoading && <p>Завантаження користувачів...</p>}
      {!isLoading && !error && users.length === 0 && !hasActiveFilters && <p>Користувачів поки немає.</p>}
      {!isLoading && !error && users.length === 0 && hasActiveFilters && <p>За вказаними фільтрами користувачів не знайдено.</p>}
      
      {users.length > 0 && (
        <>
          <h3>
            {hasActiveFilters ? "Знайдено користувачів" : "Усього користувачів"}: <strong>{total}</strong>
          </h3>
          <p>
            Показано на цій сторінці: <strong>{users.length}</strong>
          </p>
          <figure>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>ID</strong>
                  </td>
                  <td>
                    <strong>Ім’я</strong>
                  </td>
                  <td>
                    <strong>Email</strong>
                  </td>
                  <td>
                    <strong>Роль</strong>
                  </td>
                  <td>
                    <strong>Стан</strong>
                  </td>
                  <td>
                    <strong>Дії</strong>
                  </td>
                </tr>
                {users.map((currentUser) => (
                  <tr key={currentUser.id}>
                    <td>{currentUser.id}</td>
                    <td>
                      {currentUser.firstName} {currentUser.lastName}
                    </td>
                    <td>{currentUser.email}</td>
                    <td>{USER_ROLE_LABELS[currentUser.role]}</td>
                    <td>{currentUser.isActive === false ? "Неактивний" : "Активний"}</td>
                    <td>
                      <Link className="userEditBtn" to={`/users/${currentUser.id}/edit`}>
                        <span>Редагувати</span>
                      </Link>
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
