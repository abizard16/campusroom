import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cr_user')) } catch { return null }
  })
  const login = (u) => { setUser(u); try { localStorage.setItem('cr_user', JSON.stringify(u)) } catch {} }
  const logout = () => { setUser(null); try { localStorage.removeItem('cr_user') } catch {} }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
