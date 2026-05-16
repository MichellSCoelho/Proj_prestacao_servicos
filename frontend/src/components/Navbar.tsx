import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { usuario, logout, isLogado } = useAuth()
  const navigate = useNavigate()
  return (
    <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 48px', background:'rgba(10,14,26,0.95)', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:100 }}>
      <Link to="/" style={{ fontWeight:800, fontSize:20, color:'#fff', textDecoration:'none' }}>
        Meu<span style={{ color:'#FF6B35' }}>Prestador</span>
      </Link>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        {isLogado ? (
          <>
            <span style={{ color:'#8A95A8', fontSize:14 }}>Olá, {usuario?.nome}</span>
            {usuario?.tipo === 'profissional' && (
              <Link to="/painel" style={{ color:'#FF6B35', textDecoration:'none', fontSize:14, fontWeight:600 }}>📊 Painel</Link>
            )}
            <button onClick={() => { logout(); navigate('/') }} style={{ background:'#FF6B35', color:'#fff', border:'none', padding:'9px 20px', borderRadius:50, fontSize:14, fontWeight:600, cursor:'pointer' }}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ border:'1px solid rgba(255,255,255,0.15)', color:'#fff', padding:'8px 18px', borderRadius:50, fontSize:14, textDecoration:'none' }}>Entrar</Link>
            <Link to="/cadastro" style={{ background:'#FF6B35', color:'#fff', padding:'9px 20px', borderRadius:50, fontSize:14, fontWeight:600, textDecoration:'none' }}>Cadastrar-se</Link>
          </>
        )}
      </div>
    </nav>
  )
}
