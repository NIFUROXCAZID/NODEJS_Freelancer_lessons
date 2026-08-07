export default function ProductFilters({ brands = [], owners = [], filters, onChange, onApply, onReset }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <form className="sort" onSubmit={onApply}>
      <div className="sort__container">
        <div className="sort__inputWrap">
          <select className="defaultForm__select" style={{ width: "180px" }} name="brand" value={filters.brand} onChange={handleChange}>
            <option value="">Всі марки</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sort__inputWrap">
          <select className="defaultForm__select" style={{ maxWidth: "400px" }} name="owner" value={filters.owner} onChange={handleChange}>
            <option value="">Всі власники</option>
            {owners.map((owner) => (
              <option key={owner._id} value={owner._id}>
                {owner.name} — {owner.location}
              </option>
            ))}
          </select>
        </div>
        <div className="sort__inputWrap">
          <input name="minPrice" type="number" placeholder="Ціна від" value={filters.minPrice} onChange={handleChange} />
        </div>
        <div className="sort__inputWrap">
          <input name="maxPrice" type="number" placeholder="Ціна до" value={filters.maxPrice} onChange={handleChange} />
        </div>
      </div>
      <div className="sort__container">
        <div className="sort__inputWrap">
          <select className="defaultForm__select" style={{ maxWidth: "220px" }} name="sortBy" value={filters.sortBy} onChange={handleChange}>
            <option value="">Без сортування</option>
            <option value="price">За ціною</option>
            <option value="year">За роком</option>
          </select>
        </div>
        <div className="sort__inputWrap">
          <select className="defaultForm__select" style={{ maxWidth: "220px" }} name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
            <option value="asc">За зростанням</option>
            <option value="desc">За спаданням</option>
          </select>
        </div>
        <button className="defaultButton dropFilter" type="submit">
          <span>Застосувати</span>
        </button>
        <button className="defaultButton dropFilter" type="button" onClick={onReset}>
          <span>Скинути</span>
        </button>
      </div>
    </form>
  );
}
