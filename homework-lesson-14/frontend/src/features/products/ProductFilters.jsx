export default function ProductFilters({
  brands = [],
  owners = [],
  filters,
  onChange,
  onApply,
  onReset,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target

    onChange({
      ...filters,
      [name]: value,
    })
  }

  return (
    <form onSubmit={onApply}>
      <select
        name="brand"
        value={filters.brand}
        onChange={handleChange}
      >
        <option value="">Всі марки</option>
        {brands.map((brand) => (
          <option key={brand._id} value={brand._id}>
            {brand.name}
          </option>
        ))}
      </select>

      <select
        name="owner"
        value={filters.owner}
        onChange={handleChange}
      >
        <option value="">Всі власники</option>
        {owners.map((owner) => (
          <option key={owner._id} value={owner._id}>
            {owner.name} — {owner.location}
          </option>
        ))}
      </select>

      <input
        name="minPrice"
        type="number"
        placeholder="Ціна від"
        value={filters.minPrice}
        onChange={handleChange}
      />

      <input
        name="maxPrice"
        type="number"
        placeholder="Ціна до"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      <select
        name="sortBy"
        value={filters.sortBy}
        onChange={handleChange}
      >
        <option value="">Без сортування</option>
        <option value="price">За ціною</option>
        <option value="year">За роком</option>
      </select>

      <select
        name="sortOrder"
        value={filters.sortOrder}
        onChange={handleChange}
      >
        <option value="asc">За зростанням</option>
        <option value="desc">За спаданням</option>
      </select>

      <button type="submit">Застосувати</button>

      <button type="button" onClick={onReset}>
        Скинути
      </button>
    </form>
  )
}