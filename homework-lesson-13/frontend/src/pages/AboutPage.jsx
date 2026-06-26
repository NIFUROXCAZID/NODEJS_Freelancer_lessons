export default function AboutPage() {
  return (
    <main>
      <h1>About Project</h1>

      <p>
        Fleet Management System — навчальний fullstack
        проєкт для керування автопарком.
      </p>

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

      <p>
        Проєкт створено з навчальною метою для практики
        сучасної fullstack-розробки.
      </p>
    </main>
  )
}