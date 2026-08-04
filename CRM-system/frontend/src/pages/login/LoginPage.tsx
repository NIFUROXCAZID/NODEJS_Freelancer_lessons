import { Navigate } from "react-router-dom";

import { LoginForm } from "../../features/auth/ui/LoginForm";
import { useAuth } from "../../features/auth/model/AuthContext";

import styles from "@/widgets/MainLayout/MainLayout.module.scss";

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/about" replace />;
  }

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.main__container}>
          <LoginForm />
          <section>
            <h2>Доступні ролі та дані для входу</h2>
            <figure>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>Роль</strong>
                    </td>
                    <td>
                      <strong>Логін</strong>
                    </td>
                    <td>
                      <strong>Пароль</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>АДМІН</strong>
                    </td>
                    <td>
                      <strong>admin@crm.local</strong>
                    </td>
                    <td>
                      <strong>password123</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>МЕНЕДЖЕР</strong>
                    </td>
                    <td>
                      <strong>oleksandr.kovalenko@example.com</strong>
                    </td>
                    <td>
                      <strong>password123</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>РОБІТНИК</strong>
                    </td>
                    <td>
                      <strong>dmytro.melnyk@example.com</strong>
                    </td>
                    <td>
                      <strong>password123</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </figure>
          </section>
        </div>
      </main>
    </div>
  );
}
