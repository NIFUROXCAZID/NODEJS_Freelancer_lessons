import fs from 'fs'
import settings from '../settings.mjs'

class DataFileManager {
  constructor(filePath) {
    this.filePath = filePath
  }

  // Метод збереження цілого переданого через параметри масиву
  saveData(dataArray) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(dataArray), 'utf8')
    } catch (err) {
      throw new Error(`Помилка при збереженні даних: ${err.message}`)
    }
  }

  // Метод зчитування усього масиву з файлу
  loadData() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8')
      return JSON.parse(data)
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.saveData([])
        return []
      } else {
        throw new Error(`Помилка при зчитуванні даних: ${err.message}`)
      }
    }
  }
  // Метод додавання нового об'єкта
  addItem(item) {
    try {
      const data = this.loadData()
      if (!item) {
        throw new Error(`Об'єкт не передано`)
      }
      data.push(item)
      this.saveData(data)
    } catch (err) {
      throw new Error(`Помилка при додаванні`)
    }
  }

  // Метод зчитування з файлу і повернення об'єкта з заданим id
  getItemById(id) {
    try {
      const data = this.loadData()
      const item = data.find((item) => item.id == id)
      if (!item) {
        throw new Error(`Об'єкт з id ${id} не знайдено`)
      }
      return item
    } catch (err) {
      throw new Error(`Помилка при пошуку об'єкта: ${err.message}`)
    }
  }

  // Метод оновлення у файлі даних про об'єкт з заданим id
  updateItemById(id, updatedProperties) {
    try {
      const data = this.loadData()
      const index = data.findIndex((item) => item.id == id)
      if (index !== -1) {
        data[index] = { ...data[index], ...updatedProperties }
        this.saveData(data)
        return true
      } else {
        throw new Error(`Об'єкт з id ${id} не знайдено`)
      }
    } catch (err) {
      throw new Error(`Помилка при оновленні об'єкта: ${err.message}`)
    }
  }

  // Метод видалення об'єкта у файлі з заданим id
  deleteItemById(id) {
    try {
      const data = this.loadData()
      const newData = data.filter((item) => item.id != id)

      if (newData.length === data.length) {
        throw new Error(`Об'єкт з id ${id} не знайдено`)
      }
      this.saveData(newData)
    } catch (err) {
      throw new Error(`Помилка при видаленні об'єкта: ${err.message}`)
    }
  }
}

console.log('settings')
console.log(settings)

export default new DataFileManager(settings.dataPath)
