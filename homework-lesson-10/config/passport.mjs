import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

import User from '../models/User.mjs'

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })

        if (!user) {
          return done(null, false, {
            message: 'Incorrect email',
          })
        }

        const isMatch = await bcrypt.compare(
          password,
          user.password,
        )

        if (!isMatch) {
          return done(null, false, {
            message: 'Incorrect password',
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    },
  ),
)

// Записує в сесію айді через внутрішні паспорт методи, щоб кожного разу не логінитись
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Викликається вже на кожному наступному запиті. Passport бере id із сесії:
passport.deserializeUser(
  async (id, done) => {
    try {
      const user = await User.findById(id)

      if (!user) {
        return done(null, false)
      }

      done(null, user)
    } catch (err) {
      done(err)
    }
  },
)

export default passport
