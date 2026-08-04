import { useEffect, useState, type FormEventHandler } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { api } from "../../shared/api/axiosInstance";
import { useAuth } from "../../features/auth/model/AuthContext";

import type { UpdateUserData, User, UserRole } from "../../entities/user/model/user.types";

export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [role, setRole] = useState<UserRole>("WORKER");

  const [isActive, setIsActive] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const [passwordSuccess, setPasswordSuccess] = useState("");

  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (!id || !isAdmin) {
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        setError("");
        setIsLoading(true);

        const response = await api.get<User>(`/users/${id}`);

        const loadedUser = response.data;

        setUser(loadedUser);

        setFirstName(loadedUser.firstName);
        setLastName(loadedUser.lastName);
        setEmail(loadedUser.email);
        setRole(loadedUser.role);
        setIsActive(loadedUser.isActive);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;

          if (Array.isArray(message)) {
            setError(message.join(", "));
          } else if (typeof message === "string") {
            setError(message);
          } else {
            setError("Не вдалося завантажити користувача");
          }
        } else {
          setError("Сталася невідома помилка");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, [id, isAdmin]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <section>
        <h2>Редагування користувача</h2>
        <p>Ця сторінка доступна лише адміністратору.</p>
        <div className="centerBtn">
          <Link className="defaultButton" to="/dashboard">
            <span>Повернутися на головну</span>
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!id || !user) {
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const updateData: UpdateUserData = {
        firstName,
        lastName,
        email,
        role,
      };

      await api.patch(`/users/${id}`, updateData);

      if (isActive !== user.isActive) {
        await api.patch(`/users/${id}/status`, {
          isActive,
        });
      }

      navigate("/users");
    } catch (error) {
      // твій catch
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <section><p>Завантаження користувача...</p></section>;
  }

  if (!user) {
    return <section><p>Користувача не знайдено.</p></section>;
  }

  const handlePasswordSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!id) {
      return;
    }

    try {
      setPasswordError("");
      setPasswordSuccess("");
      setIsPasswordSubmitting(true);

      const response = await api.patch<{
        message: string;
      }>(`/users/${id}/password`, {
        password: newPassword,
      });

      setPasswordSuccess(response.data.message);
      setNewPassword("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setPasswordError(message.join(", "));
        } else if (typeof message === "string") {
          setPasswordError(message);
        } else {
          setPasswordError("Не вдалося змінити пароль");
        }
      } else {
        setPasswordError("Сталася невідома помилка");
      }
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const nameId = "nameId";
  const surnameId = "surnameId";
  const emailId = "emailId";
  const roleId = "roleId";
  const passId = "passId";
  const activityId = "activityId";

  return (
    <section style={{ textAlign: "center" }}>
      <h2>Редагувати користувача</h2>
      <div className="centerBtn">
        <Link className="defaultButton" to="/users">
          Назад до користувачів
        </Link>
      </div>
      <p>
        ID користувача: <strong>{user.id}</strong>
      </p>
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
            <label className="defaultForm__label" htmlFor={roleId}>
              Роль
            </label>
            <select className="defaultForm__select" style={{ maxWidth: "350px" }} id="roleId" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              <option value="WORKER">Робітник</option>
              <option value="MANAGER">Менеджер</option>
              <option value="ADMIN">Адміністратор</option>
            </select>
          </div>
          <div className=" checkbox defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={activityId}>
              Користувач активний
            </label>
            <input className="defaultForm__checkbox" id="activityId" type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
          </div>
          {error && <p role="alert">{error}</p>}
          <div className="defaultForm__btn-wrap">
            <button style={{ marginBottom: "15px" }} className="defaultButton" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? "Збереження..." : "Зберегти зміни"}</span>
            </button>
          </div>
        </form>
      </div>
      <h2>Змінити пароль</h2>
      <div className="defaultForm">
        <form className="defaultForm__form" onSubmit={handlePasswordSubmit}>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={passId}>
              Новий пароль
            </label>
            <input
              className="defaultForm__fieldInput"
              style={{ maxWidth: "350px" }}
              id={passId}
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>
          {passwordError && <p role="alert">{passwordError}</p>}
          {passwordSuccess && <p>{passwordSuccess}</p>}
          <div className="defaultForm__btn-wrap">
            <button className="defaultButton" type="submit" disabled={isPasswordSubmitting}>
              <span>{isPasswordSubmitting ? "Зміна пароля..." : "Змінити пароль"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
