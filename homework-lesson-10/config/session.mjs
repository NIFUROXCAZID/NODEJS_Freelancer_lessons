import session from "express-session";
import MongoStore from 'connect-mongo'
import 'dotenv/config'

export function sessionMiddleware({ secret, isProd }) {
  return session({
    name: "sid",
    secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      ttl: 60 * 60 * 24, // 1 day
    }),
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  });
}