import { useState, useEffect } from 'react'
import api from '../api/axios'

const CATS = ['Todos','Elétrica','Encanamento','Limpeza / Diarista','Pintura','Marcenaria','Ar-condicionado','TI & Informática','Jardinagem']
const ICONS: Record<string,string> = { 'Todos':'🔍','Elétrica':'⚡','Encanamento':'🔧','Limpeza / Diarista':'🧹','Pintura':'🎨','Marcenaria':'🛠️','Ar-condicionado':'❄️','TI & Informática':'💻','Jardinagem':'🌿' }

export default function Home() {
  const [profissionais, setProfissionais] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState(''); const [cidade, setCidade] = useState(''); const [categoria, setCategoria] = useState(''); const [total, setTotal] = useState(0)
  async function buscar(p?: any) {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (p?.categoria && p.categoria !== 'Todos') q.set('categoria', p.categoria)
      if (p?.cidade) q.set('cidade', p.cidade)
      if (p?.termo) q.set('termo', p.termo)
      const { data } = await api.get(`/profissionais?${q}`)
      setProfissionais(data.profissionais || []); setTotal(data.total || 0)
    } catch { setProfissionais([]) } finally { setLoading(false) }
  }
  useEffect(() => { buscar() }, [])
  const cores = ['#7c3aed','#059669','#dc2626','#2563eb','#d97706','#db2777']
  return (
    <div style={{ background:'#0A0E1A', minHeight:'100vh' }}>
      <div style={{ padding:'80px 48px 60px', position:'relative' }}>
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)', top:-200, right:-100, pointerEvents:'none' }} />
        <div style={{ maxWidth:620, position:'relative', zIndex:2 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.25)', color:'#FFB347', padding:'6px 14px', borderRadius:50, fontSize:11, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:28 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#FF6B35', display:'inline-block' }} />Plataforma brasileira de serviços
          </div>
          <h1 style={{ fontWeight:800, fontSize:'clamp(36px,5vw,60px)', lineHeight:1.05, letterSpacing:-2, marginBottom:20, color:'#fff' }}>
            Encontre o profissional <span style={{ background:'linear-gradient(135deg,#FF6B35,#FFB347)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>certo</span> perto de você
          </h1>
          <p style={{ color:'#8A95A8', fontSize:17, lineHeight:1.7, marginBottom:36 }}>Conectamos clientes a profissionais qualificados. Avaliações reais, preços justos.</p>
          <form onSubmit={e=>{e.preventDefault();buscar({categoria,cidade,termo:busca})}} style={{ display:'flex', background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden', maxWidth:540 }}>
            <div style={{ display:'flex', flexDirection:'column', padding:'12px 18px', flex:1, borderRight:'1px solid rgba(255,255,255,0.07)' }}>
              <label style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', color:'#8A95A8', marginBottom:4 }}>Serviço</label>
              <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Ex: eletricista..." style={{ background:'none', border:'none', color:'#fff', fontSize:14, outline:'none' }} />
            </div>
            <div style={{ display:'flex', flexDirection:'column', padding:'12px 18px', flex:1, borderRight:'1px solid rgba(255,255,255,0.07)' }}>
              <label style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', color:'#8A95A8', marginBottom:4 }}>Cidade</label>
              <input value={cidade} onChange={e=>setCidade(e.target.value)} placeholder="Ex: Manaus" style={{ background:'none', border:'none', color:'#fff', fontSize:14, outline:'none' }} />
            </div>
            <button type="submit" style={{ background:'#FF6B35', border:'none', color:'#fff', padding:'0 24px', fontWeight:700, fontSize:15, cursor:'pointer' }}>🔍</button>
          </form>
        </div>
      </div>
      <div style={{ padding:'0 48px 32px' }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {CATS.map(cat => <button key={cat} onClick={()=>{setCategoria(cat);buscar({categoria:cat,cidade,termo:busca})}} style={{ background:categoria===cat?'rgba(255,107,53,0.15)':'#111827', border:`1px solid ${categoria===cat?'rgba(255,107,53,0.4)':'rgba(255,255,255,0.07)'}`, color:categoria===cat?'#FF6B35':'#8A95A8', padding:'8px 16px', borderRadius:50, fontSize:13, cursor:'pointer' }}>{ICONS[cat]} {cat}</button>)}
        </div>
      </div>
      <div style={{ padding:'0 48px 80px' }}>
        <h2 style={{ fontWeight:700, fontSize:22, color:'#fff', marginBottom:24 }}>{loading?'Buscando...':`${total} profissional${total!==1?'is':''} encontrado${total!==1?'s':''}`}</h2>
        {loading ? <div style={{ textAlign:'center', color:'#8A95A8', padding:60 }}>Carregando...</div>
        : profissionais.length===0 ? <div style={{ textAlign:'center', color:'#8A95A8', padding:60 }}><div style={{ fontSize:48 }}>🔍</div><p>Nenhum profissional encontrado.</p></div>
        : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {profissionais.map(p => {
              const cor = cores[p.id%cores.length]; const ini = `${p.nome?.[0]??''}${p.sobrenome?.[0]??''}`
              return (
                <div key={p.id} onClick={()=>window.location.href=`/profissional/${p.id}`} style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden', cursor:'pointer', transition:'all 0.25s' }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,107,53,0.3)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'}}>
                  <div style={{ height:70, background:`linear-gradient(135deg,${cor}33,${cor}11)`, position:'relative' }}>
                    {p.verificado && <span style={{ position:'absolute', top:10, right:10, background:'rgba(59,130,246,0.2)', border:'1px solid rgba(59,130,246,0.4)', color:'#60a5fa', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:50 }}>✓ Verificado</span>}
                  </div>
                  <div style={{ padding:'0 20px 20px' }}>
                    <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${cor},${cor}99)`, border:'3px solid #111827', marginTop:-26, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18, color:'#fff' }}>{ini}</div>
                    <div style={{ fontWeight:700, fontSize:15, color:'#fff', marginBottom:2 }}>{p.nome} {p.sobrenome}</div>
                    <div style={{ color:'#FF6B35', fontSize:13, fontWeight:500, marginBottom:8 }}>{p.categoria}</div>
                    <div style={{ fontSize:13, color:'#8A95A8', lineHeight:1.6, marginBottom:14, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{p.descricao||'Profissional qualificado pronto para atender.'}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                      <span style={{ color:'#FFB347', fontSize:14 }}>{'★'.repeat(Math.round(p.media_avaliacao))} <span style={{ color:'#fff', fontSize:13 }}>{p.media_avaliacao.toFixed(1)}</span> <span style={{ color:'#8A95A8', fontSize:12 }}>({p.total_avaliacoes})</span></span>
                      <span style={{ fontSize:13, color:'#8A95A8' }}>{p.preco_hora&&<><b style={{ color:'#fff', fontSize:15 }}>R${p.preco_hora}</b>/h</>}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>}
      </div>
    </div>
  )
}
