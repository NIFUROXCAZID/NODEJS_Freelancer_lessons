import { Link } from 'react-router-dom'

import { ROUTES } from '../shared/constants/routes'

export default function HomePage() {
  return (
    <main>
      <h1>Fleet Management System</h1>

      <p>
        Ласкаво просимо до навчального fullstack застосунку
        для управління автопарком.
      </p>

      <p>
        Цей проєкт створений з використанням:
      </p>

      <ul>
        <li>React 19</li>
        <li>React Router</li>
        <li>Node.js</li>
        <li>Express.js</li>
        <li>MongoDB</li>
        <li>JWT Authentication</li>
      </ul>

      <p>
        Система дозволяє:
      </p>

      <ul>
        <li>Переглядати список автомобілів</li>
        <li>Створювати нові автомобілі</li>
        <li>Редагувати та видаляти записи</li>
        <li>Працювати з ролями користувачів</li>
      </ul>

      <Link to={ROUTES.PRODUCTS}>
        Перейти до списку автомобілів
      </Link>

      <h3>Для адміна</h3>
      <ul>
        <li>Username: <strong>Super Admin</strong></li>
        <li>Email: <strong>admin@gmail.com</strong></li>
        <li>Пароль: <strong>123</strong></li>
    </ul>
      <h3>Для менеджера</h3>
      <ul>
        <li>Username: <strong>manager</strong></li>
        <li>Email: <strong>manager@gmail.com</strong></li>
        <li>Пароль: <strong>123</strong></li>
      </ul>
        <h3>Для юзерів</h3>
        <ul>
          <li>Username: <strong>user1</strong></li>
          <li>Email: <strong>user1@gmail.com</strong></li>
          <li>Пароль: <strong>123</strong></li>
        </ul>
    </main>
  )
}