import {
  useState,
  type FormEventHandler,
} from 'react';
import axios from 'axios';

import { useAuth } from '../model/AuthContext';

export function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] =
    useState(false);

const handleSubmit: FormEventHandler<HTMLFormElement> =
  async (event) => {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      await login({
        email,
        password,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        setError(
          typeof message === 'string'
            ? message
            : 'Не вдалося увійти',
        );
      } else {
        setError('Сталася невідома помилка');
      }
    } finally {
      setIsSubmitting(false);
    }
    };
  
  const emailId = "emailId";
  const passId = "passId";

  return (
    <section>
      <h1 style={{ textAlign: "center" }}>Вхід до CRM</h1>
      <div className="defaultForm">
        <form className="defaultForm__form" onSubmit={handleSubmit}>
          <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
            <label className="defaultForm__label" htmlFor={emailId}>
              Email
            </label>
            <input
              className="defaultForm__fieldInput"
              style={{ maxWidth: "350px" }}
              id={emailId}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
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
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <div className="defaultForm__btn-wrap">
            <button className="defaultForm__send" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? "Вхід..." : "Увійти"}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}