import http from 'http'

// створюємо сервер
const server = http.createServer((req, res) => {
  const url = req.url

  // ---------------- season ----------------
  if (url === '/season') {
    const month = new Date().getMonth() + 1

    let season = ''

    if (month === 12 || month === 1 || month === 2) {
      season = 'Winter'
    } else if (month >= 3 && month <= 5) {
      season = 'Spring'
    } else if (month >= 6 && month <= 8) {
      season = 'Summer'
    } else {
      season = 'Autumn'
    }

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
    })

    res.end(`Season: ${season}`)
    return
  }

  // ---------------- day ----------------
  if (url === '/day') {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    const day = days[new Date().getDay()]

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
    })

    res.end(`Day: ${day}`)
    return
  }

  // ---------------- time ----------------
  if (url === '/time') {
    const hour = new Date().getHours()

    let timeOfDay = ''

    if (hour >= 5 && hour < 12) {
      timeOfDay = 'Morning'
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = 'Afternoon'
    } else {
      timeOfDay = 'Evening'
    }

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
    })

    res.end(`Time of day: ${timeOfDay}`)
    return
  }

  // ---------------- 404 ----------------
  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8',
  })

  res.end('Route not found!')
})

// запуск сервера
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})