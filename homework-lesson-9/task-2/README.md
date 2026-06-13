# Інструкція з відтворення проєкту

## 1. Створіть нову папку для проєкту

## 2. Ініціалізуйте Node.js проєкт

```
npm init -y
```

## 3. Встановіть необхідні модулі

```
npm install express mongoose zod ejs multer
```

(Додайте інші залежності, якщо вони використовуються у вашому коді.)

## 4. Створіть структуру папок

- bin/
- config/
- controllers/
- db/
- models/post/
- models/type/
- models/user/
- public/images/
- public/javascripts/
- public/stylesheets/posts/
- public/stylesheets/products/
- public/stylesheets/types/
- public/stylesheets/users/
- routes/
- uploads/
- utils/
- validators/
- views/posts/
- views/sections/
- views/types/
- views/users/

## 5. Створіть основні файли

- app.mjs — головний файл додатку Express.
- package.json — автоматично створюється.
- bin/www.mjs — стартовий скрипт для запуску сервера.
- config/default.mjs — налаштування (наприклад, порт, URI БД).
- db/connectDB.mjs — підключення до MongoDB.
- controllers/ — контролери для кожної сутності.
- models/ — моделі Mongoose для Post, Type, User.
- routes/ — маршрути для кожної сутності.
- utils/ — допоміжні модулі (наприклад, UploadManager, FilesManager).
- validators/ — валідація даних через Zod.
- views/ — шаблони EJS для сторінок.

## 6. Додайте код для підключення Express, Mongoose, EJS, Multer, Zod у відповідні файли

Наприклад, у app.mjs:

```js
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import indexRouter from './routes/index.mjs'
// ...інші імпорти

const app = express()
// ...налаштування app, підключення middleware, роутів, views
export default app
```

## 7. Налаштуйте підключення до MongoDB у db/connectDB.mjs

```js
import mongoose from 'mongoose'
const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/your_db',
  )
}
export default connectDB
```

## 8. Створіть моделі Mongoose для Post, Type, User у відповідних файлах

## 9. Створіть контролери для CRUD-операцій у controllers/

## 10. Створіть роутери для кожної сутності у routes/

## 11. Додайте шаблони EJS у views/ для форм, списків, секцій

## 12. Додайте статичні файли (JS, CSS, зображення) у public/

## 13. Додайте валідацію через Zod у validators/

## 14. Додайте логіку для завантаження файлів через Multer у utils/UploadManager.mjs

## 15. Додайте скрипт запуску у package.json

```json
"scripts": {
  "start": "node ./bin/www.mjs"
}
```

## 16. Запустіть сервер

```
npm start
```

## 17. Перевірте роботу проєкту у браузері за адресою http://localhost:3000 (або порт, який вказаний у config)

---

Якщо потрібен приклад коду для конкретного файлу — зверніться до відповідного пункту інструкції.
