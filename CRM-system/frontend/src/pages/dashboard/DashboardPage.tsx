import { useEffect, useState } from "react";
import axios from "axios";

import { USER_ROLE_LABELS } from "../../entities/user/model/user.constants";
import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";
import type { DashboardData } from "../../entities/dashboard/model/dashboard.types";

export function DashboardPage() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setError("");
      setIsLoading(true);

      const response = await api.get<DashboardData>("/dashboard/me");

      setDashboard(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(", "));
        } else if (typeof message === "string") {
          setError(message);
        } else {
          setError("Не вдалося завантажити статистику");
        }
      } else {
        setError("Сталася невідома помилка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (isLoading) {
    return <section><p>Завантаження статистики...</p></section>;
  }

  return (
    <section>
      <h1>Панель керування</h1>
      <p>
        Поточний користувач{" "}
        <strong>
          {user?.firstName} {user?.lastName}
        </strong>
      </p>
      <p>
        Роль: <strong>{user ? USER_ROLE_LABELS[user.role] : "—"}</strong>
      </p>
      {error && (
        <>
          <p role="alert">{error}</p>
          <button className="defaultButton" type="button" onClick={() => void loadDashboard()}>
            <span>Спробувати ще раз</span>
          </button>
        </>
      )}

      {dashboard && (
        <>
          {dashboard.users && (
            <section>
              <h2>Користувачі</h2>
              <figure>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Усього</strong>
                      </td>
                      <td>
                        <strong>Адміністратори</strong>
                      </td>
                      <td>
                        <strong>Менеджери</strong>
                      </td>
                      <td>
                        <strong>Робітники</strong>
                      </td>
                      <td>
                        <strong>Активні користувачі</strong>
                      </td>
                      <td>
                        <strong>Неактивні користувачі</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{dashboard.users.total}</td>
                      <td>{dashboard.users.admins}</td>
                      <td>{dashboard.users.managers}</td>
                      <td>{dashboard.users.workers}</td>
                      <td>{dashboard.users.active}</td>
                      <td>{dashboard.users.total - dashboard.users.active}</td>
                    </tr>
                  </tbody>
                </table>
              </figure>
            </section>
          )}
          {dashboard.projects && (
            <section>
              <h2>Проєкти</h2>
              <figure>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Усього</strong>
                      </td>
                      <td>
                        <strong>Активні</strong>
                      </td>
                      <td>
                        <strong>Завершені</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{dashboard.projects.total}</td>
                      <td>{dashboard.projects.active}</td>
                      <td>{dashboard.projects.completed}</td>
                    </tr>
                  </tbody>
                </table>
              </figure>
              <h3>Проєкти за пріоритетом</h3>
              <figure>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Пріоритет</strong>
                      </td>
                      <td>
                        <strong>Кількість проєктів</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Низький</td>
                      <td>{dashboard.projects.byPriority.low ?? 0}</td>
                    </tr>
                    <tr>
                      <td>Середній</td>
                      <td>{dashboard.projects.byPriority.medium ?? 0}</td>
                    </tr>

                    <tr>
                      <td>Високий</td>
                      <td>{dashboard.projects.byPriority.high ?? 0}</td>
                    </tr>

                    <tr>
                      <td>Критичний</td>
                      <td>{dashboard.projects.byPriority.critical ?? 0}</td>
                    </tr>
                  </tbody>
                </table>
              </figure>
            </section>
          )}
          {dashboard.tasks && (
            <section>
              <h2>Задачі</h2>
              <figure>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Усього</strong>
                      </td>
                      <td>
                        <strong>Очікують виконання</strong>
                      </td>
                      <td>
                        <strong>У роботі</strong>
                      </td>
                      <td>
                        <strong>На перевірці</strong>
                      </td>
                      <td>
                        <strong>Виконані</strong>
                      </td>
                      <td>
                        <strong>Прострочені</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{dashboard.tasks.total}</td>
                      <td>{dashboard.tasks.todo}</td>
                      <td>{dashboard.tasks.inProgress}</td>
                      <td>{dashboard.tasks.inReview}</td>
                      <td>{dashboard.tasks.done}</td>
                      <td>{dashboard.tasks.overdue}</td>
                    </tr>
                  </tbody>
                </table>
              </figure>
              <h3>Задачі за пріоритетом</h3>
              <figure>
                <table>
                  <tbody>
                    <tr>
                      <td>Пріоритет</td>
                      <td>Кількість задач</td>
                    </tr>
                    <tr>
                      <td>Низький</td>
                      <td>{dashboard.tasks.byPriority.low ?? 0}</td>
                    </tr>
                    <tr>
                      <td>Середній</td>
                      <td>{dashboard.tasks.byPriority.medium ?? 0}</td>
                    </tr>
                    <tr>
                      <td>Високий</td>
                      <td>{dashboard.tasks.byPriority.high ?? 0}</td>
                    </tr>
                    <tr>
                      <td>Критичний</td>
                      <td>{dashboard.tasks.byPriority.critical ?? 0}</td>
                    </tr>
                  </tbody>
                </table>
              </figure>
            </section>
          )}
        </>
      )}
    </section>
  );
}
