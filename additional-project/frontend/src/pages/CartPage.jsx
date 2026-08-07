import { useCart } from '../features/cart/useCart'

export default function CartPage() {
  const {
    items,
    totalPrice,
    isCartLoading,
    increaseItem,
    decreaseItem,
    removeItem,
    clear,
  } = useCart()

  if (isCartLoading) return <section><p>Завантаження...</p></section>

  return (
    <section>
      <h1>Кошик</h1>
      {!items.length ? (
        <p>Кошик порожній</p>
      ) : (
        <>
          {items.map((item) => (
            <div className="product" key={item.product._id}>
              <h3 className="product__title">{item.product.title}</h3>
              <div className="product__dids">
                <p className="product__price">{item.product.price}$</p>
                <button className="product__dec" onClick={() => decreaseItem(item.product._id)}>
                  -
                </button>
                <span className="product__quantity"> {item.quantity} </span>
                <button className="product__inc" onClick={() => increaseItem(item.product._id)}>
                  +
                </button>
                <button className="product__remove" onClick={() => removeItem(item.product._id)}>
                  Видалити
                </button>
              </div>
            </div>
          ))}

          <h3>
            Загальна вартість: <strong>{totalPrice}</strong>$
          </h3>
          <button className="defaultButton" onClick={clear}>
            <span>Очистити кошик</span>
          </button>
        </>
      )}
    </section>
  );
}