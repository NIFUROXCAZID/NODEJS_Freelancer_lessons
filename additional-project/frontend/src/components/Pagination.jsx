export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null
  }

  const pages = Array.from(
    { length: pagination.totalPages },
    (_, index) => index + 1,
  )

  return (
    <div className="pagination" aria-label="Пагінація користувачів">
      <button className="pagination__btn" type="button" disabled={!pagination.hasPrevPage} onClick={() => onPageChange(pagination.page - 1)}>
        Назад
      </button>
      {pages.map((page) => (
        <button className="pagination__btn pagination__btn--num" key={page} type="button" disabled={page === pagination.page} onClick={() => onPageChange(page)}>
          {page}
        </button>
      ))}
      <button className="pagination__btn" type="button" disabled={!pagination.hasNextPage} onClick={() => onPageChange(pagination.page + 1)}>
        Вперед
      </button>
    </div>
  );
}