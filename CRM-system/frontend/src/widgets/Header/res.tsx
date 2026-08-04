import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/model/AuthContext";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <h1>CRM System</h1>

      <nav>
        <NavLink to="/about">ПРО CRM</NavLink>

        {" | "}
        <NavLink to="/dashboard">Dashboard</NavLink>

        {" | "}

        <NavLink to="/projects">Проєкти</NavLink>

        {" | "}

        <NavLink to="/tasks">Задачі</NavLink>
        {" | "}
        {user?.role === "ADMIN" && <NavLink to="/users">Користувачі</NavLink>}
      </nav>

      <div>
        <span>
          {user?.firstName} {user?.lastName}
          {" — "}
          {user?.role}
        </span>

        <button type="button" onClick={() => void logout()}>
          Вийти
        </button>
      </div>
    </header>
  );
}
