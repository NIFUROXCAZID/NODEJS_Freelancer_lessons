import { Link } from 'react-router-dom'

import { ROUTES } from '../shared/constants/routes'

export default function HomePage() {
  return (
    <section>
      <h1>Сервіс поставок автомобілів</h1>
      <p>Ласкаво просимо до fullstack застосунку для управління поставками автомобілів.</p>
      <p>Цей проєкт створений з використанням:</p>
      <h2>Основні можливості</h2>
      <ul>
        <li>JWT авторизація</li>
        <li>Розмежування ролей користувачів</li>
        <li>CRUD операції над автомобілями</li>
        <li>Завантаження зображень</li>
        <li>Фільтрація автомобілів</li>
        <li>REST API</li>
      </ul>
      <h2>Технології</h2>
      <ul>
        <li>Frontend: React + Vite</li>
        <li>Backend: Node.js + Express</li>
        <li>Database: MongoDB + Mongoose</li>
        <li>Authentication: JWT + Cookies</li>
      </ul>
      <figure>
        <table>
          <tbody>
            <tr>
              <td>
                <strong>Роль</strong>
              </td>
              <td>
                <strong>Email</strong>
              </td>
              <td>
                <strong>Пароль</strong>
              </td>
              <td>
                <strong>Username</strong>
              </td>
            </tr>
            <tr>
              <td>Адмін</td>
              <td>admin@gmail.com</td>
              <td>123</td>
              <td>Super Admin</td>
            </tr>
            <tr>
              <td>Менеджер</td>
              <td>manager@gmail.com</td>
              <td>123</td>
              <td>manager</td>
            </tr>
            <tr>
              <td>Юзер</td>
              <td>user1@gmail.com</td>
              <td>123</td>
              <td>user1</td>
            </tr>
          </tbody>
        </table>
      </figure>
    </section>
  );
}