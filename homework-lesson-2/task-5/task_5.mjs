import { createServer } from 'node:http'
import fs from 'fs'

/*
  🔧 Читаємо файл налаштувань settings.json
  Тут зберігається:
  - який route показує історію
  - назва файлу для історії
*/
const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'))

const HISTORY_FILE = settings.historyFile
const HISTORY_ROUTE = settings.historyRoute

/*
  📊 Завантаження історії з файлу
  Якщо файлу нема — повертаємо пустий об'єкт {}
*/
function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return {}
  return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'))
}

/*
  💾 Збереження історії у файл
  JSON.stringify перетворює об'єкт у текст
  null, 2 — це форматування (красиві відступи)
*/
function saveHistory(data) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2))
}

/*
  ➕ Збільшення лічильника для конкретного маршруту
*/
function incrementRoute(route) {
  const history = loadHistory()

  // якщо маршруту ще не було — створюємо його
  if (!history[route]) {
    history[route] = 0
  }

  // +1 відвідування
  history[route]++

  // зберігаємо назад у файл
  saveHistory(history)
}

/*
  🌐 Створення HTTP сервера
*/
const server = createServer((req, res) => {
  const url = req.url

  /*
    📊 Якщо користувач відкрив маршрут історії
    (наприклад /history)
  */
  if (url === HISTORY_ROUTE) {
    const history = loadHistory()

    // говоримо браузеру що це JSON
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8'
    })

    // віддаємо історію
    res.end(JSON.stringify(history, null, 2))
    return
  }

  /*
    🧭 Вибір HTML файлу по URL
  */
  let file = ''

  if (url === '/') file = 'index.html'
  else if (url === '/coffee') file = 'coffee.html'
  else if (url === '/music') file = 'music.html'
  else {
    // якщо маршрут невідомий
    res.writeHead(404)
    res.end('Not found')
    return
  }

  /*
    📈 рахуємо відвідування сторінки
    кожен раз коли хтось зайшов — +1
  */
  incrementRoute(url)

  /*
    📄 читаємо HTML файл і відправляємо в браузер
  */
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(500)
      res.end('Server error')
      return
    }

    // говоримо браузеру що це HTML + UTF-8 (щоб працювала кирилиця)
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    })

    res.end(data)
  })
})

/*
  🚀 запуск сервера на порту 3000
*/
server.listen(3000, () => {
  console.log('http://localhost:3000')
})