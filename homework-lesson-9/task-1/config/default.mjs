import 'dotenv/config'

export default Object.freeze({
  databaseName: process.env.DATABASE_NAME,
  databaseUrl: process.env.MONGODB_URL,
  mongoURI: `${process.env.MONGODB_URL}${process.env.DATABASE_NAME}`,
  // mongoURI: `${process.env.MONGODB_URL}`,
  port: process.env.PORT,
})
