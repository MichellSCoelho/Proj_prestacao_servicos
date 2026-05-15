import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import PerfilProfissional from './pages/PerfilProfissional'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ background: '#0A0E1A', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/profissional/:id" element={<PerfilProfissional />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
