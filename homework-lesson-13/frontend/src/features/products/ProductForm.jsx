import { useForm } from 'react-hook-form'

export default function ProductForm({
  defaultValues = {},
  brands = [],
  owners = [],
  onSubmit,
  submitText = 'Save',
  isSubmitting = false,
  serverError = '',
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      title: defaultValues.title || '',
      year: defaultValues.year || '',
      number: defaultValues.number || '',
      price: defaultValues.price || '',
      brand: defaultValues.brand?._id || defaultValues.brand || '',
      owner: defaultValues.owner?._id || defaultValues.owner || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Марка автомобіля</label>
        <input
          type="text"
          {...register('title', {
            required: 'Вкажіть марку автомобіля',
          })}
        />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <div>
        <label>Рік випуску</label>
        <input
          type="text"
          {...register('year', {
            required: 'Вкажіть рік',
          })}
        />
        {errors.year && <p>{errors.year.message}</p>}
      </div>

      <div>
        <label>Номер автомобіля</label>
        <input
          type="text"
          {...register('number', {
            required: 'Вкажіть номер',
          })}
        />
        {errors.number && <p>{errors.number.message}</p>}
      </div>

      <div>
        <label>Ціна</label>
        <input
          type="number"
          {...register('price', {
            required: 'Вкажіть ціну',
            min: {
              value: 0,
              message: 'Ціна не може бути меншою за 0',
            },
          })}
        />
        {errors.price && <p>{errors.price.message}</p>}
      </div>

      <div>
        <label>Бренд</label>
        <select
          {...register('brand', {
            required: 'Оберіть бренд',
          })}
        >
          <option value="">Оберіть бренд</option>

          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
        {errors.brand && <p>{errors.brand.message}</p>}
      </div>

      <div>
        <label>Власник</label>
        <select
          {...register('owner', {
            required: 'Оберіть власника',
          })}
        >
          <option value="">Оберіть власника</option>

          {owners.map((owner) => (
            <option key={owner._id} value={owner._id}>
              {owner.name} — {owner.location}
            </option>
          ))}
        </select>
        {errors.owner && <p>{errors.owner.message}</p>}
      </div>

      <div>
        <label>Фото</label>
        <input type="file" accept="image/*" {...register('photo')} />
      </div>

      {serverError && <p>{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : submitText}
      </button>
    </form>
  )
}