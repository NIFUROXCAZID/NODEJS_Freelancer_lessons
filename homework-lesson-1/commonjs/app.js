const http = require('http');

const readData = require('./reader');
// Створюємо сервер
const server = http.createServer((req, res) => {

    const role = req.url.slice(1);
    // Викликаємо нашу функцію з іншого файлу.
    const result = readData(role);

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.end(result || 'Role not found');
});

server.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000');
});

// Це була Commonjs версія