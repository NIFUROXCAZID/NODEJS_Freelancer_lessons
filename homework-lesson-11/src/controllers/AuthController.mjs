import bcrypt from 'bcrypt'
import UserDBService from '../services/userDBService.mjs'
import TokenService from '../services/tokenService.mjs'

class AuthController {
  // =========================
  // GET /login
  // =========================
  static showLogin(req, res) {
    res.render('auth/login', { error: null })
  }

  // =========================
  // POST /login (JWT)
  // =========================
  static async postLogin(req, res) {
    try {
      // console.log('LOGIN HIT', req.body)

      const { email, password } = req.body

      const user = await UserDBService.getByEmail(email)
      // console.log('USER OBJECT:', user)
      // console.log('USER ID:', user._id)

      if (!user) {
        return res.status(400).render('auth/login', {
          error: 'Incorrect email or password',
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).render('auth/login', {
          error: 'Incorrect email or password',
        })
      }

      // 🔥 FIX HERE
      const tokens = TokenService.generateTokens(user)
      // console.log('TOKENS:', tokens)
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      })

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.redirect('/products')

    } catch (err) {
      // console.log('LOGIN ERROR:', err)

      return res.status(500).render('auth/login', {
        error: err.message,
      })
    }
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

      const existing = await UserDBService.getByEmail(email)

      if (existing) {
        return res.status(400).render('auth/register', {
          error: 'User already exists',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await UserDBService.create({
        username,
        email,
        password: hashedPassword,
        role: 'user',
      })

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
  static logout(req, res) {
    // просто чистимо cookies
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    return res.redirect('/auth/login')
  }
}

export default AuthController