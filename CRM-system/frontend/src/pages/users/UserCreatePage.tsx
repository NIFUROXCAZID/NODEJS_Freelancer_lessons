import { useState, type FormEventHandler } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";

import type { CreateUserData, User, UserRole } from "../../entities/user/model/user.types";

export function UserCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<UserRole>("WORKER");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const userData: CreateUserData = {
        firstName,
        lastName,
        email,
        password,
        role,
      };

      const response = await api.post<User>("/users", userData);

      navigate(`/users/${response.data.id}/edit`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("CREATE USER ERROR:", error.response?.data);

        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(", "));
        } else if (typeof message === "string") {
          setError(message);
        } else {
          setError("Не вдалося створити користувача");
        }
      } else {
        setError("Сталася невідома помилка");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameId = "nameId";
  const surnameId = "surnameId";
  const emailId = "emailId";
  const passId = "passId";
  const roleId = "roleId";

  return (
    <section style={{ textAlign: "center" }}>
      <h2>Створити користувача</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to="/users">
          Назад до користувачів
        </Link>
      </div>
      <div className="defaultForm">
        <form className="defaultForm__form" onSubmit={handleSubmit}>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={nameId}>
              Ім’я
            </label>
            <input className="defaultForm__fieldInput" style={{ maxWidth: "350px" }} id={nameId} type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={surnameId}>
              Прізвище
            </label>
            <input className="defaultForm__fieldInput" style={{ maxWidth: "350px" }} id={surnameId} type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={emailId}>
              Email
            </label>
            <input className="defaultForm__fieldInput" style={{ maxWidth: "350px" }} id={emailId} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={passId}>
              Пароль
            </label>
            <input
              className="defaultForm__fieldInput"
              style={{ maxWidth: "350px" }}
              id={passId}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={roleId}>
              Роль
            </label>
            <select className="defaultForm__select" style={{ maxWidth: "350px" }} id="roleId" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              <option value="WORKER">Робітник</option>
              <option value="MANAGER">Менеджер</option>
              <option value="ADMIN">Адміністратор</option>
            </select>
          </div>
          {error && <p role="alert">{error}</p>}
          <div className="defaultForm__btn-wrap">
            <button className="defaultButton" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? "Створення..." : "Створити користувача"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
