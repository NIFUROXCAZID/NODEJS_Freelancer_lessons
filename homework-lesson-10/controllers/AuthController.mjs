import passport from 'passport'
import bcrypt from 'bcrypt'
import UserDBService from '../services/userDBService.mjs'

class AuthController {
  // =========================
  // GET /login
  // =========================
  static showLogin(req, res) {
    // ШЛЯХ ДО EJS У VIEWS БЕЗ / НА ПОЧАТКУ
    res.render('auth/login', { error: null })
  }

  // =========================
  // POST /login (Passport)
  // =========================
  static postLogin(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) return next(err)

      if (!user) {
        return res.status(400).render('auth/login', {
          error: info?.message || 'Invalid credentials',
        })
      }

      req.logIn(user, function (err) {
        if (err) return next(err)

        return res.redirect('/products')
      })
    })(req, res, next)
  }

  // =========================
  // GET /register
  // =========================
  static showRegister(req, res) {
    res.render('auth/register', { error: null })
  }

  // =========================
  // POST /register
  // =========================
  static async postRegister(req, res) {
    try {
      const { username, email, password } = req.body

      // перевірка чи існує юзер
      const existing = await UserDBService.getByEmail(email)

      if (existing) {
        return res.status(400).render('auth/register', {
          error: 'User already exists',
        })
      }

      // хеш пароля
      const hashedPassword = await bcrypt.hash(password, 10)

      // створення юзера
      await UserDBService.create({
        username,
        email,
        password: hashedPassword,
        role: 'user',
      })
      // ЮРЛ РЕДІРЕКТА ТРЕБА / НА ПОЧАТКУ
      return res.redirect('/auth/login')
    } catch (err) {
      return res.status(500).render('auth/register', {
        error: err.message,
      })
    }
  }

  // =========================
  // POST /logout
  // =========================
  static logout(req, res, next) {
    req.logout(function (err) {
      if (err) return next(err)
      res.redirect('/auth/login')
    })
  }
}

export default AuthController