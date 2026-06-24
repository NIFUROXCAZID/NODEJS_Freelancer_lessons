import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { getMe, login as loginApi, logout as logoutApi } from './authApi'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // перевірка авторизації при старті застосунку
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getMe()

        setUser(data.user)
      } catch (error) {
        console.log('Not authenticated')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // логін
  const login = async (credentials) => {
    const data = await loginApi(credentials)

    setUser(data.user)

    return data
  }

  // логаут
  const logout = async () => {
    try {
      await logoutApi()
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    setUser,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
