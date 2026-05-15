import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' }); const [erro, setErro] = useState(''); const [loading, setLoading] = useState(false)
  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); setErro(''); setLoading(true); try { await login(form.email, form.senha); navigate('/') } catch { setErro('E-mail ou senha incorretos.') } finally { setLoading(false) } }
  const inp: React.CSSProperties = { width:'100%', background:'#0A0E1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'11px 14px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }
  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'36px 40px', width:'100%', maxWidth:440 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:'#fff', marginBottom:28, textAlign:'center' }}>Entrar na plataforma</h2>
        {erro && <div style={{ background:'rgba(220,38,38,0.1)', color:'#fca5a5', padding:'10px 14px', borderRadius:10, marginBottom:20, fontSize:14 }}>{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>E-mail</label><input type="email" required style={inp} placeholder="seu@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} /></div>
          <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Senha</label><input type="password" required style={inp} placeholder="••••••••" value={form.senha} onChange={e => setForm({...form, senha:e.target.value})} /></div>
          <button type="submit" disabled={loading} style={{ width:'100%', padding:14, background:'#FF6B35', color:'#fff', border:'none', borderRadius:50, fontSize:15, fontWeight:700, cursor:'pointer' }}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <p style={{ color:'#8A95A8', fontSize:14, textAlign:'center', marginTop:20 }}>Não tem conta? <Link to="/cadastro" style={{ color:'#FF6B35', textDecoration:'none' }}>Cadastre-se</Link></p>
      </div>
    </div>
  )
}
