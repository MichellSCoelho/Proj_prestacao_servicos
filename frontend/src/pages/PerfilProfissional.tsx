import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

export default function PerfilProfissional() {
  const { id } = useParams(); const { usuario, isLogado } = useAuth()
  const [perfil, setPerfil] = useState<any>(null); const [avaliacoes, setAvaliacoes] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [nota, setNota] = useState(0); const [comentario, setComentario] = useState(''); const [msg, setMsg] = useState(''); const [enviando, setEnviando] = useState(false)
  useEffect(() => { async function load() { try { const [{ data:p },{ data:a }] = await Promise.all([api.get(`/profissionais/${id}`),api.get(`/avaliacoes/profissional/${id}`)]); setPerfil(p); setAvaliacoes(a.avaliacoes||[]) } finally { setLoading(false) } }; load() }, [id])
  async function enviar(e: React.FormEvent) { e.preventDefault(); if(!nota) return setMsg('Selecione uma nota.'); setEnviando(true); try { await api.post('/avaliacoes',{profissional_id:Number(id),nota,comentario}); setMsg('✅ Avaliação enviada!'); setNota(0); setComentario(''); const {data} = await api.get(`/avaliacoes/profissional/${id}`); setAvaliacoes(data.avaliacoes||[]) } catch(err:any){setMsg(err.response?.data?.detail||'Erro.')} finally{setEnviando(false)} }
  if (loading) return <div style={{ textAlign:'center', color:'#8A95A8', padding:80 }}>Carregando...</div>
  if (!perfil) return <div style={{ textAlign:'center', color:'#8A95A8', padding:80 }}>Não encontrado.</div>
  const cor = ['#7c3aed','#059669','#dc2626','#2563eb'][perfil.id%4]; const ini = `${perfil.nome?.[0]??''}${perfil.sobrenome?.[0]??''}`
  const inp: React.CSSProperties = { width:'100%', background:'#0A0E1A', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'11px 14px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }
  return (
    <div style={{ background:'#0A0E1A', minHeight:'100vh', padding:'40px 48px' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ height:120, borderRadius:16, background:`linear-gradient(135deg,${cor}33,${cor}11)`, marginBottom:-40 }} />
        <div style={{ padding:'0 24px 40px' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:16, marginBottom:20 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:`linear-gradient(135deg,${cor},${cor}99)`, border:'4px solid #0A0E1A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:28, color:'#fff' }}>{ini}</div>
            <div style={{ paddingBottom:8 }}>
              <h1 style={{ fontWeight:800, fontSize:22, color:'#fff' }}>{perfil.nome} {perfil.sobrenome}</h1>
              <div style={{ color:'#FF6B35', fontSize:14 }}>{perfil.categoria}</div>
            </div>
            {perfil.verificado && <div style={{ marginLeft:'auto', paddingBottom:8, background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.4)', color:'#60a5fa', fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:50 }}>✓ Verificado</div>}
          </div>
          <div style={{ display:'flex', gap:32, marginBottom:24 }}>
            <div><div style={{ fontWeight:800, fontSize:28, color:'#fff' }}>{perfil.media_avaliacao.toFixed(1)}</div><div style={{ color:'#FFB347' }}>{'★'.repeat(Math.round(perfil.media_avaliacao))}</div><div style={{ color:'#8A95A8', fontSize:12 }}>{perfil.total_avaliacoes} avaliações</div></div>
            {perfil.preco_hora && <div style={{ borderLeft:'1px solid rgba(255,255,255,0.07)', paddingLeft:32 }}><div style={{ fontWeight:800, fontSize:28, color:'#fff' }}>R${perfil.preco_hora}</div><div style={{ color:'#8A95A8', fontSize:12 }}>por hora</div></div>}
          </div>
          {perfil.descricao && <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20, marginBottom:24 }}><p style={{ color:'#8A95A8', fontSize:14, lineHeight:1.7 }}>{perfil.descricao}</p></div>}
          <div style={{ color:'#8A95A8', fontSize:14, marginBottom:24 }}>📍 {perfil.cidade}, {perfil.estado} {perfil.disponivel && <span style={{ marginLeft:16, color:'#22c55e' }}>● Disponível</span>}</div>
          <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:24, marginBottom:24 }}>
            <div style={{ fontWeight:700, fontSize:17, color:'#fff', marginBottom:16 }}>Avaliações ({avaliacoes.length})</div>
            {avaliacoes.length===0 ? <p style={{ color:'#8A95A8' }}>Nenhuma avaliação ainda.</p> : avaliacoes.map(av=>(
              <div key={av.id} style={{ paddingBottom:14, marginBottom:14, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontWeight:600, fontSize:14, color:'#fff' }}>{av.cliente_nome||'Cliente'}</span><span style={{ color:'#FFB347' }}>{'★'.repeat(av.nota)}</span></div>
                {av.comentario && <p style={{ color:'#8A95A8', fontSize:13, fontStyle:'italic' }}>"{av.comentario}"</p>}
              </div>
            ))}
          </div>
          {isLogado && usuario?.tipo==='cliente' && (
            <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:24 }}>
              <div style={{ fontWeight:700, fontSize:17, color:'#fff', marginBottom:16 }}>Avaliar profissional</div>
              <form onSubmit={enviar}>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:'block', fontSize:12, color:'#8A95A8', marginBottom:8 }}>Sua nota</label>
                  <div style={{ display:'flex', gap:4 }}>{[1,2,3,4,5].map(e=><span key={e} onClick={()=>setNota(e)} style={{ fontSize:28, color:e<=nota?'#FFB347':'#444', cursor:'pointer' }}>★</span>)}</div>
                </div>
                <div style={{ marginBottom:14 }}><textarea style={{...inp, height:80, resize:'none'}} placeholder="Comentário (opcional)" value={comentario} onChange={e=>setComentario(e.target.value)} /></div>
                {msg && <div style={{ color:msg.startsWith('✅')?'#22c55e':'#fca5a5', fontSize:13, marginBottom:12 }}>{msg}</div>}
                <button type="submit" disabled={enviando} style={{ padding:'12px 28px', background:'#FF6B35', color:'#fff', border:'none', borderRadius:50, fontWeight:700, cursor:'pointer' }}>{enviando?'Enviando...':'⭐ Enviar avaliação'}</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
