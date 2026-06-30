export default Object.freeze({
  databaseName: process.env.DATABASE_NAME,
  databaseUrl: process.env.MONGODB_URL,
  mongoURI: `${process.env.MONGODB_URL}`,
  port: process.env.PORT || 3000,
})

// СУТЬ 👉 “збирає всі змінні з .env в один об’єкт config і інкапсулює ховає”