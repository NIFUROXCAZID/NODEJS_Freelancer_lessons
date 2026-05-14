import { createServer } from 'node:http'
import fs from 'fs'

const server = createServer((req, res) => {
  let filePath = ''

  // ---------------- HOME ----------------
  if (req.url === '/') {
    filePath = 'index.html'
  }

  // ---------------- COFFEE ----------------
  else if (req.url === '/coffee') {
    filePath = 'coffee.html'
  }

  // ---------------- MUSIC ----------------
  else if (req.url === '/music') {
    filePath = 'task-4/music.html'
  }

  // ---------------- 404 ----------------
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Page not found!')
    return
  }

  // читаємо HTML файл
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Server error!')
      return
    }

    // повертаємо HTML
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(data)
  })
})

// запуск сервера
server.listen(3000, () => {
  console.log('http://localhost:3000')
})


// node task-4/task_4.mjs