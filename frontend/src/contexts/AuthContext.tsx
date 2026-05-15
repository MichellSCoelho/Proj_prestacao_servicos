import { createContext, useContext, useState, ReactNode } from 'react'
import api from '../api/axios'
interface Usuario { id: number; nome: string; sobrenome: string; email: string; tipo: 'cliente' | 'profissional'; cidade?: string; estado?: string }
interface AuthContextType { usuario: Usuario | null; token: string | null; login: (email: string, senha: string) => Promise<void>; logout: () => void; isLogado: boolean }
const AuthContext = createContext<AuthContextType>({} as AuthContextType)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => { const s = localStorage.getItem('usuario'); return s ? JSON.parse(s) : null })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  async function login(email: string, senha: string) { const { data } = await api.post('/auth/login', { email, senha }); setToken(data.access_token); setUsuario(data.usuario); localStorage.setItem('token', data.access_token); localStorage.setItem('usuario', JSON.stringify(data.usuario)) }
  function logout() { setToken(null); setUsuario(null); localStorage.removeItem('token'); localStorage.removeItem('usuario') }
  return <AuthContext.Provider value={{ usuario, token, login, logout, isLogado: !!token }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
