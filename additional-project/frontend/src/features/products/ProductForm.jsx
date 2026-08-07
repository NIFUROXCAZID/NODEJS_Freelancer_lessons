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

  const markId = "markId";
  const ageId = "ageId";
  const numberId = "numberId";
  const priceId = "priceId";
  const brandId = "brandId";
  const providerId = "providerId";
  const photoId = "photoId";

  return (
    <div className="defaultForm">
      <form className="defaultForm__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
          <label className="defaultForm__label" htmlFor={markId}>
            Марка автомобіля
          </label>
          <input
            className="defaultForm__fieldInput"
            style={{ maxWidth: "350px" }}
            id={markId}
            type="text"
            {...register("title", {
              required: "Вкажіть марку автомобіля",
            })}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>
        <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
          <label className="defaultForm__label" htmlFor={ageId}>
            Рік випуску
          </label>
          <input
            className="defaultForm__fieldInput"
            style={{ maxWidth: "350px" }}
            id={ageId}
            type="text"
            {...register("year", {
              required: "Вкажіть рік",
            })}
          />
          {errors.year && <p>{errors.year.message}</p>}
        </div>
        <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
          <label className="defaultForm__label" htmlFor={numberId}>
            Номер автомобіля
          </label>
          <input
            className="defaultForm__fieldInput"
            style={{ maxWidth: "350px" }}
            type="text"
            id={numberId}
            {...register("number", {
              required: "Вкажіть номер",
            })}
          />
          {errors.number && <p>{errors.number.message}</p>}
        </div>
        <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
          <label className="defaultForm__label" htmlFor={priceId}>
            Ціна
          </label>
          <input
            className="defaultForm__fieldInput"
            style={{ maxWidth: "350px" }}
            type="number"
            id={priceId}
            {...register("price", {
              required: "Вкажіть ціну",
              min: {
                value: 0,
                message: "Ціна не може бути меншою за 0",
              },
            })}
          />
          {errors.price && <p>{errors.price.message}</p>}
        </div>
        <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
          <label className="defaultForm__label" htmlFor={brandId}>
            Бренд
          </label>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "350px" }}
            id={brandId}
            {...register("brand", {
              required: "Оберіть бренд",
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
        <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
          <label className="defaultForm__label" htmlFor={providerId}>
            Постачальник
          </label>
          <select
            className="defaultForm__select"
            style={{ maxWidth: "550px" }}
            id={providerId}
            {...register("owner", {
              required: "Оберіть постачальника",
            })}
          >
            <option value="">Оберіть постачальника</option>
            {owners.map((owner) => (
              <option key={owner._id} value={owner._id}>
                {owner.name} — {owner.location}
              </option>
            ))}
          </select>
          {errors.owner && <p>{errors.owner.message}</p>}
        </div>
        <div className="defaultForm__inputsWrapper defaultForm__inputsWrapper--center">
          <label className="defaultForm__label" htmlFor={photoId}>
            Фото
          </label>
          <input className="defaultForm__fieldInput" style={{ maxWidth: "350px" }} id={photoId} type="file" accept="image/*" {...register("photo")} />
        </div>
        {serverError && <p>{serverError}</p>}
        <div className="defaultForm__btn-wrap">
          <button className="defaultButton" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Loading..." : submitText}</span>
          </button>
        </div>
      </form>
    </div>
  );
}