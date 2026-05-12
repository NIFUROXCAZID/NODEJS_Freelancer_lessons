// Підключаємо модуль fs Він дозволяє працювати з файлами.
const fs = require('fs');

function readData(role) {
  // Читаємо файл
  const data = fs.readFileSync('./data.json', 'utf8');
  // Перетворює текст JSON у JavaScript-об'єкт.
  const jsonData = JSON.parse(data);
  // Повернення значення
  return jsonData[role];
}

module.exports = readData;