import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const CATS = ['Elétrica','Encanamento','Limpeza / Diarista','Pintura','Marcenaria','Ar-condicionado','TI & Informática','Jardinagem','Outros']
export default function Cadastro() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'cliente'|'profissional'>('cliente')
  const [form, setForm] = useState({ nome:'', sobrenome:'', email:'', telefone:'', senha:'', cidade:'', estado:'AM', categoria:'', descricao:'', preco_hora:'' })
  const [erro, setErro] = useState(''); const [sucesso, setSucesso] = useState(false); const [loading, setLoading] = useState(false)
  const set = (c: string, v: string) => setForm(f => ({...f, [c]:v}))
  const inp: React.CSSProperties = { width:'100%', background:'#0A0E1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'11px 14px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setLoading(true)
    try {
      await api.post('/auth/cadastro', { nome:form.nome, sobrenome:form.sobrenome, email:form.email, telefone:form.telefone, senha:form.senha, tipo, cidade:form.cidade, estado:form.estado })
      if (tipo === 'profissional' && form.categoria) { const { data } = await api.post('/auth/login', { email:form.email, senha:form.senha }); localStorage.setItem('token', data.access_token); await api.post('/profissionais', { categoria:form.categoria, descricao:form.descricao, cidade:form.cidade, estado:form.estado, preco_hora:form.preco_hora ? Number(form.preco_hora) : undefined }); localStorage.removeItem('token') }
      setSucesso(true); setTimeout(() => navigate('/login'), 2000)
    } catch(err: any) { setErro(err.response?.data?.detail || 'Erro ao cadastrar.') } finally { setLoading(false) }
  }
  if (sucesso) return <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ textAlign:'center' }}><div style={{ fontSize:48 }}>🎉</div><h2 style={{ color:'#22c55e', marginTop:16 }}>Cadastro realizado! Redirecionando...</h2></div></div>
  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'36px 40px', width:'100%', maxWidth:480 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:'#fff', marginBottom:24, textAlign:'center' }}>Criar conta</h2>
        <div style={{ display:'flex', gap:4, background:'#0A0E1A', padding:4, borderRadius:10, marginBottom:24 }}>
          {(['cliente','profissional'] as const).map(t => <button key={t} onClick={() => setTipo(t)} style={{ flex:1, padding:9, border:'none', borderRadius:8, cursor:'pointer', background:tipo===t?'#1a2235':'none', color:tipo===t?'#fff':'#8A95A8', fontWeight:500, fontSize:14 }}>{t==='cliente'?'👤 Sou Cliente':'🔧 Sou Profissional'}</button>)}
        </div>
        {erro && <div style={{ background:'rgba(220,38,38,0.1)', color:'#fca5a5', padding:'10px 14px', borderRadius:10, marginBottom:16, fontSize:14 }}>{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
            <div><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Nome</label><input style={inp} required placeholder="Nome" value={form.nome} onChange={e=>set('nome',e.target.value)} /></div>
            <div><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Sobrenome</label><input style={inp} required placeholder="Sobrenome" value={form.sobrenome} onChange={e=>set('sobrenome',e.target.value)} /></div>
          </div>
          <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>E-mail</label><input style={inp} type="email" required placeholder="seu@email.com" value={form.email} onChange={e=>set('email',e.target.value)} /></div>
          <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Telefone</label><input style={inp} placeholder="(92) 9 0000-0000" value={form.telefone} onChange={e=>set('telefone',e.target.value)} /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
            <div><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Cidade</label><input style={inp} required placeholder="Manaus" value={form.cidade} onChange={e=>set('cidade',e.target.value)} /></div>
            <div><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Estado</label><select style={inp} value={form.estado} onChange={e=>set('estado',e.target.value)}>{UFS.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
          </div>
          {tipo==='profissional' && <>
            <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Categoria</label><select style={inp} required value={form.categoria} onChange={e=>set('categoria',e.target.value)}><option value="">Selecione...</option>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Descrição</label><textarea style={{...inp, height:80, resize:'none'}} placeholder="Descreva seus serviços..." value={form.descricao} onChange={e=>set('descricao',e.target.value)} /></div>
            <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Valor/hora (R$)</label><input style={inp} type="number" placeholder="Ex: 80" value={form.preco_hora} onChange={e=>set('preco_hora',e.target.value)} /></div>
          </>}
          <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:11, color:'#8A95A8', marginBottom:6, textTransform:'uppercase' }}>Senha</label><input style={inp} type="password" required minLength={6} placeholder="Mínimo 6 caracteres" value={form.senha} onChange={e=>set('senha',e.target.value)} /></div>
          <button type="submit" disabled={loading} style={{ width:'100%', padding:14, background:'#FF6B35', color:'#fff', border:'none', borderRadius:50, fontSize:15, fontWeight:700, cursor:'pointer' }}>{loading?'Criando...':'Criar minha conta'}</button>
        </form>
        <p style={{ color:'#8A95A8', fontSize:14, textAlign:'center', marginTop:20 }}>Já tem conta? <Link to="/login" style={{ color:'#FF6B35', textDecoration:'none' }}>Entrar</Link></p>
      </div>
    </div>
  )
}
