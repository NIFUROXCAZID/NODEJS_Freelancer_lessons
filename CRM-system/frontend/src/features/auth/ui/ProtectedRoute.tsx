import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../model/AuthContext";
import styles from "@/widgets/MainLayout/MainLayout.module.scss";

export function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();

  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className={styles.wrapper}>
        <main className={styles.main}>
          <div className={styles.main__container}>
            <section><p>Перевіряємо авторизацію...</p></section>
          </div>
        </main>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
