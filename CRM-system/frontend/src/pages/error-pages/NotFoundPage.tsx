import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section>
      <h2>Сторінку не знайдено</h2>
      <p>Такої сторінки не існує або адресу введено неправильно.</p>
      <div className="centerBtn">
        <Link className="defaultButton" to="/dashboard">
          <span>Повернутися на головну</span>
        </Link>
      </div>
    </section>
  );
}
