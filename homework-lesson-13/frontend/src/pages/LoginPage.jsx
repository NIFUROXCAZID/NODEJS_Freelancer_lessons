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

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>

          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
            })}
          />

          {errors.email && (
            <p>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
            })}
          />

          {errors.password && (
            <p>{errors.password.message}</p>
          )}
        </div>

        {serverError && <p>{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  )
}