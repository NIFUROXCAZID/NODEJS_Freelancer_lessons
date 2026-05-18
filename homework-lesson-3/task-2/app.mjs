import http from 'http'
import fs from 'fs'

// створення сервера
const server = http.createServer((req, res) => {
  const url = req.url

  let filePath = ''

  // ---------------- ROUTES ----------------

  if (url === '/') {
    filePath = 'index.html'
  } else if (url === '/coffee') {
    filePath = 'coffee.html'
  } else if (url === '/music') {
    filePath = 'music.html'
  } else {
    // якщо route не знайдено
    res.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
    })

    res.end('Page not found!')
    return
  }

  // ---------------- READ HTML ----------------

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain; charset=utf-8',
      })

      res.end('Server error!')
      return
    }

    // успішна відповідь
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    })

    res.end(data)
  })
})

// запуск сервера
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})