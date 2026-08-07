import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../features/auth/useAuth'
import { ROUTES } from '../shared/constants/routes'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setServerError('')

      await login(data)

      navigate(ROUTES.PRODUCTS)
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Login failed'
      )
    }
  }

  const emailId = "emailId";
  const passId = "passId";

  return (
    <section style={{ textAlign: "center" }}>
      <h1>Логін</h1>
      <div className="defaultForm" style={{marginBottom: "16px"}}>
        <form className="defaultForm__form" onSubmit={handleSubmit(onSubmit)}>
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
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          {serverError && <p>{serverError}</p>}
          <div className="defaultForm__btn-wrap">
            <button className="defaultButton" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? "Завантаження..." : "Логін"}</span>
            </button>
          </div>
        </form>
      </div>
      <figure>
        <table>
          <tbody>
            <tr>
              <td><strong>Роль</strong></td>
              <td><strong>Email</strong></td>
              <td><strong>Пароль</strong></td>
            </tr>
            <tr>
              <td>Адмін</td>
              <td>admin@gmail.com</td>
              <td>123</td>
            </tr>
            <tr>
              <td>Менеджер</td>
              <td>manager@gmail.com</td>
              <td>123</td>
            </tr>
            <tr>
              <td>Юзер</td>
              <td>user1@gmail.com</td>
              <td>123</td>
            </tr>
          </tbody>
        </table>
      </figure>
    </section>
  );
}