import { Link } from "react-router-dom";

export function ForbiddenPage() {
  return (
    <section>
      <h2>Доступ заборонено</h2>
      <p>У вас немає прав для перегляду цієї сторінки.</p>
      <div className="centerBtn">
        <Link className="defaultButton" to="/dashboard">
          <span>Повернутися на головну</span>
        </Link>
      </div>
    </section>
  );
}
