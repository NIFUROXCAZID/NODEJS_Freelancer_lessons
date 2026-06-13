class FormManager {
  constructor(fields, submitCallback, initialValues = {}) {
    this.fields = fields
    this.submitCallback = submitCallback
    this.initialValues = initialValues
    this.isEditMode = Object.keys(initialValues).length > 0
    this.formData = { ...initialValues }
    this.proxyData = new Proxy(this.formData, {
      set: (target, prop, value) => {
        target[prop] = value
        this.updateButtonState()
        return true
      },
    })
    this.form = this.createForm()
    this.submitButton = this.createSubmitButton()
    this.form.appendChild(this.submitButton)
  }

  createForm() {
    const form = document.createElement('form')
    this.fields.forEach((field) => {
      const fieldContainer = document.createElement('div')
      const label = document.createElement('label')
      label.textContent = field.label
      let input
      if (field.type === 'select') {
        input = document.createElement('select')
        if (field.multiple) input.setAttribute('multiple', true)
        if (field.required) input.setAttribute('required', true)

        if (Array.isArray(field.options)) {
          field.options.forEach((optionValue) => {
            const option = document.createElement('option')
            option.value = optionValue._id
            option.textContent = optionValue.name
            input.appendChild(option)
          })
        }

        // Заповнення початкових значень для select з multiple
        if (this.isEditMode && this.initialValues[field.name]) {
          const values = this.initialValues[field.name]
          Array.from(input.options).forEach((option) => {
            if (values.includes(option.value)) {
              option.selected = true
            }
          })
        }

        input.addEventListener('change', (e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => option.value
          )
          this.proxyData[field.name] = selectedOptions
        })
      } else {
        input = document.createElement('input')
        Object.keys(field).forEach((attr) => {
          if (attr !== 'label') {
            input.setAttribute(attr, field[attr])
          }
        })

        if (this.isEditMode && this.initialValues[field.name]) {
          if (field.type === 'file') {
            input.setAttribute('data-initial', this.initialValues[field.name])
          } else {
            input.value = this.initialValues[field.name]
          }
        }

        if (field.type === 'file') {
          const img = document.createElement('img')
          img.style.display = 'none'
          img.style.maxWidth = '200px'
          img.style.marginTop = '10px'
          fieldContainer.appendChild(img)

          input.addEventListener('change', (e) => {
            const file = e.target.files[0]
            if (file) {
              const reader = new FileReader()
              reader.onloadend = () => {
                img.src = reader.result
                img.style.display = 'block'
                this.proxyData[field.name] = reader.result
              }
              reader.readAsDataURL(file)
            }
          })

          if (this.isEditMode && this.initialValues[field.name]) {
            img.src = this.initialValues[field.name]
            img.style.display = 'block'
          }
        } else {
          input.addEventListener('input', (e) => {
            this.proxyData[field.name] = e.target.value
          })
        }
      }

      label.appendChild(input)
      fieldContainer.appendChild(label)
      form.appendChild(fieldContainer)
    })
    return form
  }

  createSubmitButton() {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = this.isEditMode ? 'Зберегти' : 'Створити'
    button.disabled = true
    button.addEventListener('click', () => {
      if (this.isValidForm()) {
        this.submitCallback(this.proxyData)
      }
    })
    return button
  }

  isValidForm() {
    return this.fields.every((field) => {
      if (field.type === 'select') return true
      const input = this.form.querySelector(`[name="${field.name}"]`)
      return input.checkValidity()
    })
  }

  updateButtonState() {
    this.submitButton.disabled = !this.isValidForm()
  }

  render(containerId) {
    const container = document.getElementById(containerId)
    if (container) {
      container.appendChild(this.form)
    } else {
      console.error(`Container with id "${containerId}" not found.`)
    }
  }
}
