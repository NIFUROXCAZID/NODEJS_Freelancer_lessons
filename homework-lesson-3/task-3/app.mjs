import http from 'http'
import fs from 'fs'

// створення сервера
const server = http.createServer((req, res) => {
  const url = req.url

  // ---------------- HOME ----------------
  if (url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
    })

    res.end('Привіт! Ласкаво просимо!')
    return
  }

  // ---------------- GOALS ----------------
  if (url === '/goals') {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
    })

    res.end('Мої цілі: вивчити Node.js та backend')
    return
  }

  // ---------------- ABOUT HTML ----------------
  if (url === '/about') {
    fs.readFile('about.html', (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end('Server error!')
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      })

      res.end(data)
    })

    return
  }

  // ---------------- NEWS HTML ----------------
  if (url === '/news') {
    fs.readFile('news.html', (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end('Server error!')
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      })

      res.end(data)
    })

    return
  }

  // ---------------- DYNAMIC PARAMS ----------------
  if (url.startsWith('/info/')) {
    // отримуємо параметр після /info/
    const param = url.split('/')[2]

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
    })

    if (param === 'sites') {
      res.end(`
Google: https://google.com
YouTube: https://youtube.com
GitHub: https://github.com
`)
    } else if (param === 'films') {
      res.end(`
Netflix: https://netflix.com
Megogo: https://megogo.net
SweetTV: https://sweet.tv
`)
    } else if (param === 'me') {
      res.end(`
Мене звати Владислав.
Я вивчаю Node.js.
`)
    } else {
      res.end('Unknown parameter!')
    }

    return
  }

  // ---------------- 404 ----------------
  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8',
  })

  res.end('Page not found!')
})

// запуск сервера
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})

// http://localhost:3000/
// Home
// Goals
// /About
// /News
// /info/sites
// /info/films
// /info/me

// 🧠 Найважливіше тут
// 📌 1. Статичні маршрути
// if (url === '/goals')
// 👉 URL фіксований.

// 📌 2. Статичні HTML файли
// fs.readFile('about.html')
// 👉 сервер читає HTML файл.

// 📌 3. Динамічний параметр
// url.startsWith('/info/')
// /info/sites
// /info/me
// /info/films

// 📌 split('/')
// const param = url.split('/')[2]
//   / info / sites
// ['', 'info', 'sites']

// 🧠 Це дуже схоже на:
// /info/:myLinks
// в Express.