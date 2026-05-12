import fs from 'fs';

export function readData(role) {

    const data = fs.readFileSync('./data.json', 'utf8');

    const jsonData = JSON.parse(data);

    return jsonData[role];
}