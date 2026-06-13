class RequestManager {
  //---- data from params
  static async doPostRequest(url, data, redirectRoute) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        window.location.href = redirectRoute
      } else {
        const result = await response.json()
        this.showErrors(result.errors)
      }
    } catch (error) {
      console.error('Error:', error)
      this.showErrors([{ message: 'Network error. Please try again later.' }])
    }
  }

  static showErrors(errors) {
    const errorsContainer = document.getElementById('errors')
    errorsContainer.innerHTML = ''
    errors.forEach((error) => {
      const errorMessage = document.createElement('div')
      errorMessage.classList.add('error-message')
      errorMessage.textContent = error.message
      errorsContainer.appendChild(errorMessage)
    })
  }
  //--- data from form
  static async postFormRequest(url, form) {
    const formData = new FormData(form)

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    return data
  }

  static async postRequest(route, body) {
    const response = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
  }

  static async deleteRequest(route, id) {
    const response = await fetch(route, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    const data = await response.json()
    // Оновлення поточного вікна без використання кешу
    window.location.reload(true)
    return data
  }

  static handleFileSelect(event, imgSelector) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = function (e) {
        const imgElement = document.querySelector(imgSelector)
        imgElement.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}
