import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

if (!ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET is required')
}

if (!REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET is required')
}

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    ACCESS_SECRET,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    },
  )
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
    },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRES_IN,
    },
  )
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET)
}

// src /
// │
// ├── config /
// │   └── jwt.mjs ✅
// │
// ├── services /
// │   ├── userDBService.mjs ✅
// │   └── tokenService.mjs ✅
// │
// ├── middleware /
// │   └── auth.middleware.mjs ✅
// │
// ├── controllers /
// │   └── authController.mjs ✅
// │
// ├── routes /
// │   └── auth.mjs ✅
// │
// └── models /
//     ├── User.mjs ✅
//     └── RefreshToken.mjs ✅