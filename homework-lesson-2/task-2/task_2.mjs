import { createServer } from 'node:http'
import fs from 'fs'

const FILE_NAME = 'numbers.txt'

const server = createServer((req, res) => {
  const url = req.url

  // ---------------- SAVE NUMBER ----------------
  if (url.startsWith('/save_num/')) {
    const number = url.split('/')[2]

    fs.appendFileSync(FILE_NAME, number + '\n')

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(`Number ${number} saved!`)
    return
  }

  // ---------------- SUM ----------------
  if (url === '/sum') {
    if (!fs.existsSync(FILE_NAME)) {
      res.end('File numbers.txt not found!')
      return
    }

    const data = fs.readFileSync(FILE_NAME, 'utf8')

    const numbers = data
      .split('\n')
      .filter((el) => el !== '')
      .map((el) => parseInt(el))

    const sum = numbers.reduce((prev, el) => prev + el, 0)

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(`Sum = ${sum}`)
    return
  }

  // ---------------- MULT ----------------
  if (url === '/mult') {
    if (!fs.existsSync(FILE_NAME)) {
      res.end('File numbers.txt not found!')
      return
    }

    const data = fs.readFileSync(FILE_NAME, 'utf8')

    const numbers = data
      .split('\n')
      .filter((el) => el !== '')
      .map((el) => parseInt(el))

    const mult = numbers.reduce((prev, el) => prev * el, 1)

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(`Multiplication = ${mult}`)
    return
  }

  // ---------------- REMOVE ----------------
  if (url === '/remove') {
    if (fs.existsSync(FILE_NAME)) {
      fs.unlinkSync(FILE_NAME)

      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('numbers.txt deleted!')
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('File not found!')
    }

    return
  }

  // ---------------- DEFAULT ----------------
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Route not found!')
})

// запуск сервера
server.listen(3000, () => {
  console.log('Server running:')
  console.log('http://localhost:3000')
})


// http://localhost:3000/save_num/78
// http://localhost:3000/sum
// http://localhost:3000/mult
// http://localhost:3000/remove


// Метод	Для чого
// createServer()	HTTP сервер
// req.url	отримати URL
// appendFileSync()	додати число у файл
// readFileSync()	прочитати файл
// split('\n')	розбити текст на числа
// reduce()	сума / добуток
// unlinkSync()	видалити файл

// Метод	Для чого
// fs.readFileSync()	читати файл
// fs.writeFileSync()	записати файл
// fs.appendFileSync()	додати в файл
// fs.unlinkSync()	видалити файл
// fs.existsSync()	перевірити існування