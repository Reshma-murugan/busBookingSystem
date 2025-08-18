import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, getUser, setAuth, clearAuth } from '../utils/auth'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken())
  const [user, setUser] = useState(getUser())

  const login = (newToken, newUser) => {
    setAuth(newToken, newUser)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    clearAuth()
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const storedToken = getToken()
    const storedUser = getUser()
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    }
  }, [])

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}