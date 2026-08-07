import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { register as registerApi } from '../features/auth/authApi'
import { ROUTES } from '../shared/constants/routes'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setServerError('')

      await registerApi(data)

      navigate(ROUTES.LOGIN)
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Registration failed'
      )
    }
  }

  const usernameId = "usernameId";
  const emailId = "emailId";
  const passId = "passId";

  return (
    <section style={{ textAlign: "center" }}>
      <h1>Реєстрація</h1>
      <div className="defaultForm">
        <form className="defaultForm__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={usernameId}>
              Юзернейм
            </label>
            <input
              className="defaultForm__fieldInput"
              style={{ maxWidth: "350px" }}
              id={usernameId}
              type="text"
              {...register("username", {
                required: "Юзернейм обов'язковий",
                minLength: {
                  value: 2,
                  message: "Мінімум два символи",
                },
              })}
            />
            {errors.username && <p>{errors.username.message}</p>}
          </div>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={emailId}>
              Email
            </label>
            <input
              className="defaultForm__fieldInput"
              style={{ maxWidth: "350px" }}
              id={emailId}
              type="email"
              {...register("email", {
                required: "Email обов'язковий",
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
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
              {...register("password", {
                required: "Пароль обов'язковий",
                minLength: {
                  value: 3,
                  message: "Мінімум 3 символи",
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          {serverError && <p>{serverError}</p>}
          <div className="defaultForm__btn-wrap">
            <button className="defaultButton" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Завантаження..." : "Зареєструватись"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}