import { createServer } from 'node:http'

const server = createServer((req, res) => {
  const url = req.url.slice(1)

  // розбиваємо URL
  const parts = url.split('/')

  // операція
  const operation = parts[0]

  // числа
  const numbers = parts[1]
    .split('-')
    .map((el) => parseInt(el))

  let result

  // ---------------- ADD ----------------
  if (operation === 'add') {
    result = numbers.reduce((sum, el) => sum + el, 0)
  }

  // ---------------- SUBTRACT ----------------
  else if (operation === 'subtract') {
    result = numbers.reduce((res, el) => res - el)
  }

  // ---------------- MULT ----------------
  else if (operation === 'mult') {
    result = numbers.reduce((res, el) => res * el, 1)
  }

  // ---------------- WRONG ROUTE ----------------
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Unknown operation!')
    return
  }

  // відповідь
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(`Result = ${result}`)
})

// запуск сервера
server.listen(3000, () => {
  console.log('http://localhost:3000')
})

// http://localhost:3000/add/12-4-23-45
// Result = 84

// http://localhost:3000/subtract/100-20-10
// Result = 70

// http://localhost:3000/mult/100-8-2
// Result = 1600