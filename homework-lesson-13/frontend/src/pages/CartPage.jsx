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

  if (isCartLoading) return <h2>Loading...</h2>

  return (
    <main>
      <h1>Кошик</h1>

      {!items.length ? (
        <p>Кошик порожній</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.product._id}>
              <h3>{item.product.title}</h3>
              <p>{item.product.price}$</p>

              <button onClick={() => decreaseItem(item.product._id)}>
                -
              </button>

              <span> {item.quantity} </span>

              <button onClick={() => increaseItem(item.product._id)}>
                +
              </button>

              <button onClick={() => removeItem(item.product._id)}>
                Видалити
              </button>

              <hr />
            </div>
          ))}

          <h2>Загальна вартість: {totalPrice}$</h2>

          <button onClick={clear}>
            Очистити кошик
          </button>
        </>
      )}
    </main>
  )
}