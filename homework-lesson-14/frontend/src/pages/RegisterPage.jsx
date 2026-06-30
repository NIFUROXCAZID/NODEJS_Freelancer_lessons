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

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>

          <input
            type="text"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 2,
                message:
                  'Minimum 2 characters',
              },
            })}
          />

          {errors.username && (
            <p>{errors.username.message}</p>
          )}
        </div>

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
              minLength: {
                value: 3,
                message:
                  'Minimum 3 characters',
              },
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
          {isSubmitting
            ? 'Loading...'
            : 'Register'}
        </button>
      </form>
    </div>
  )
}