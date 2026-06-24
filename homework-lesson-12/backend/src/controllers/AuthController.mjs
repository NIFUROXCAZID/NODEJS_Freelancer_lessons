import bcrypt from 'bcrypt'
import UserDBService from '../services/userDBService.mjs'
import TokenService from '../services/tokenService.mjs'

class AuthController {
  static async postLogin(req, res) {
    try {
      const { email, password } = req.body

      const user = await UserDBService.getByEmail(email)

      if (!user) {
        return res.status(401).json({
          message: 'Incorrect email or password',
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(401).json({
          message: 'Incorrect email or password',
        })
      }

      const tokens = TokenService.generateTokens(user)

      await TokenService.saveRefreshToken(user._id, tokens.refreshToken)

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:
          process.env.NODE_ENV === 'production'
            ? 'none'
            : 'lax',
        maxAge: 15 * 60 * 1000,
      })

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:
          process.env.NODE_ENV === 'production'
            ? 'none'
            : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  }

  static async postRegister(req, res) {
    try {
      const { username, email, password } = req.body

      const existing = await UserDBService.getByEmail(email)

      if (existing) {
        return res.status(409).json({
          message: 'User already exists',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await UserDBService.create({
        username,
        email,
        password: hashedPassword,
        role: 'user',
      })

      return res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  }

  static async logout(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken

      if (refreshToken) {
        await TokenService.removeRefreshToken(refreshToken)
      }

      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')

      return res.status(200).json({
        message: 'Logged out successfully',
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  }

  static async refresh(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken

      if (!refreshToken) {
        return res.status(401).json({
          message: 'No refresh token',
        })
      }

      const tokenFromDb = await TokenService.findRefreshToken(refreshToken)

      if (!tokenFromDb) {
        return res.status(401).json({
          message: 'Refresh token not found',
        })
      }

      const decoded = TokenService.verifyRefresh(refreshToken)

      const user = await UserDBService.getByEmail
        ? await UserDBService.getById(decoded.id)
        : null

      if (!user) {
        return res.status(401).json({
          message: 'User not found',
        })
      }

      const tokens = TokenService.generateTokens(user)

      await TokenService.removeRefreshToken(refreshToken)
      await TokenService.saveRefreshToken(user._id, tokens.refreshToken)

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

      return res.status(200).json({
        message: 'Token refreshed',
        user,
      })
    } catch (err) {
      return res.status(401).json({
        message: 'Invalid refresh token',
      })
    }
  }

  static async me(req, res) {
    return res.status(200).json({
      user: req.user,
    })
  }
}

export default AuthController
