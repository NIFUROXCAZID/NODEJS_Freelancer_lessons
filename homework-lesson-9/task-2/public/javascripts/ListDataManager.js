class ListDataManager {
  static createTableHeader(fields) {
    const thead = document.createElement('thead')
    const headerRow = document.createElement('tr')

    for (let key in fields) {
      const th = document.createElement('th')
      th.textContent = fields[key]
      headerRow.appendChild(th)
    }

    const editTh = document.createElement('th')
    editTh.textContent = 'Редагувати'
    headerRow.appendChild(editTh)

    const deleteTh = document.createElement('th')
    deleteTh.textContent = 'Видалити'
    headerRow.appendChild(deleteTh)

    thead.appendChild(headerRow)
    return thead
  }

  static createTableRow(item, fields, createLinkFunction, deleteFunction) {
    const row = document.createElement('tr')

    for (let key in fields) {
      const td = document.createElement('td')
      if (key === 'img') {
        const img = document.createElement('img')
        img.src = item[key]
        img.alt = fields[key]
        img.style.width = '100px' // Задайте бажану ширину зображення
        td.appendChild(img)
      } else {
        td.textContent = item[key]
      }
      row.appendChild(td)
    }

    const editTd = document.createElement('td')
    const editLink = document.createElement('a')
    editLink.href = createLinkFunction(item._id)
    editLink.textContent = 'Редагувати'
    editTd.appendChild(editLink)
    row.appendChild(editTd)

    const deleteTd = document.createElement('td')
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Видалити'
    deleteButton.onclick = () => deleteFunction(item._id)
    deleteTd.appendChild(deleteButton)
    row.appendChild(deleteTd)

    return row
  }

  static createTableFromList(data, fields, createLinkFunction, deleteFunction) {
    // Створення таблиці
    const table = document.createElement('table')
    table.border = '1'

    // Створення заголовку таблиці
    const thead = this.createTableHeader(fields)
    table.appendChild(thead)

    // Створення тіла таблиці
    const tbody = document.createElement('tbody')

    data.forEach((item) => {
      const row = this.createTableRow(
        item,
        fields,
        createLinkFunction,
        deleteFunction
      )
      tbody.appendChild(row)
    })

    table.appendChild(tbody)

    // Виведення таблиці на сторінку
    return table
  }
}
