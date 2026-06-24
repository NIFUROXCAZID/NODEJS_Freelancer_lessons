document.addEventListener('DOMContentLoaded', () => {

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.delete-btn')
    if (!btn) return

    const id = btn.dataset.id

    try {
      const res = await fetch(`/products/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        window.location.reload()
      }
    } catch (err) {
      console.log(err)
    }
  })

})