import http from 'http';

import { readData } from './reader.mjs';

const server = http.createServer((req, res) => {

    const role = req.url.slice(1);

    const result = readData(role);

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.end(result || 'Role not found');
});

server.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000');
});