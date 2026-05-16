import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import UploadFotoPerfil from '../components/UploadFotoPerfil'
import { useAuth } from '../contexts/AuthContext'

interface Servico { id: number; titulo: string; status: string; cliente_nome?: string; valor_combinado?: number; valor_final?: number; data_agendada?: string; criado_em: string }
interface Avaliacao { id: number; nota: number; comentario?: string; cliente_nome?: string; criado_em: string; resposta_profissional?: string }
interface Perfil { id: number; categoria: string; descricao?: string; preco_hora?: number; preco_visita?: number; disponivel: boolean; media_avaliacao: number; total_avaliacoes: number; total_servicos: number; cidade: string; estado: string; foto_url?: string }

const STATUS_COR: Record<string,string> = { pendente:'#FFB347', aceito:'#60a5fa', em_andamento:'#a78bfa', concluido:'#22c55e', cancelado:'#f87171', recusado:'#6b7280' }
const STATUS_LABEL: Record<string,string> = { pendente:'⏳ Pendente', aceito:'✅ Aceito', em_andamento:'🔧 Em andamento', concluido:'🎉 Concluído', cancelado:'❌ Cancelado', recusado:'🚫 Recusado' }
const card: React.CSSProperties = { background:'#111827', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:24 }
const inp: React.CSSProperties = { width:'100%', background:'#0A0E1A', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 14px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:11, fontWeight:600, color:'#8A95A8', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }

export default function PainelProfissional() {
  const { usuario, isLogado } = useAuth()
  const navigate = useNavigate()
  const [aba, setAba] = useState<'resumo'|'servicos'|'avaliacoes'|'perfil'>('resumo')
  const [perfil, setPerfil] = useState<Perfil|null>(null)
  const [servicos, setServicos] = useState<Servico[]>([])
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [editForm, setEditForm] = useState({ descricao:'', preco_hora:'', preco_visita:'', disponivel:true })
  const [salvando, setSalvando] = useState(false)
  const [msgSalvo, setMsgSalvo] = useState('')
  const [respostaId, setRespostaId] = useState<number|null>(null)
  const [respostaTexto, setRespostaTexto] = useState('')
  const [atualizandoId, setAtualizandoId] = useState<number|null>(null)

  useEffect(() => { if (!isLogado || usuario?.tipo !== 'profissional') { navigate('/login'); return }; carregarDados() }, [])

  async function carregarDados() {
    setLoading(true)
    try {
      const [{ data: srv }] = await Promise.all([api.get('/servicos')])
      setServicos(srv.servicos || [])
      try {
        const { data: p } = await api.get('/profissionais/me')
        setPerfil(p)
        setEditForm({ descricao:p.descricao||'', preco_hora:p.preco_hora?.toString()||'', preco_visita:p.preco_visita?.toString()||'', disponivel:p.disponivel })
        const { data: avs } = await api.get(`/avaliacoes/profissional/${p.id}`)
        setAvaliacoes(avs.avaliacoes || [])
      } catch {}
    } finally { setLoading(false) }
  }

  async function salvarPerfil(e: React.FormEvent) {
    e.preventDefault(); setSalvando(true)
    try {
      await api.put('/profissionais/me', { descricao:editForm.descricao, preco_hora:editForm.preco_hora?Number(editForm.preco_hora):null, preco_visita:editForm.preco_visita?Number(editForm.preco_visita):null, disponivel:editForm.disponivel })
      setMsgSalvo('✅ Perfil atualizado!'); carregarDados()
    } catch { setMsgSalvo('❌ Erro ao salvar.') }
    finally { setSalvando(false); setTimeout(()=>setMsgSalvo(''),3000) }
  }

  async function mudarStatus(servicoId: number, novoStatus: string) {
    setAtualizandoId(servicoId)
    try { await api.patch(`/servicos/${servicoId}/status`, { status:novoStatus }); carregarDados() }
    finally { setAtualizandoId(null) }
  }

  async function enviarResposta(avaliacaoId: number) {
    if (!respostaTexto.trim()) return
    try { await api.post(`/avaliacoes/${avaliacaoId}/resposta`, { resposta:respostaTexto }); setRespostaId(null); setRespostaTexto(''); carregarDados() } catch {}
  }

  const total = servicos.length
  const concluidos = servicos.filter(s=>s.status==='concluido').length
  const pendentes = servicos.filter(s=>s.status==='pendente').length
  const ganhos = servicos.filter(s=>s.status==='concluido').reduce((acc,s)=>acc+(s.valor_final||s.valor_combinado||0),0)
  const meses = Array.from({length:6},(_,i)=>{ const d=new Date(); d.setMonth(d.getMonth()-(5-i)); return { label:d.toLocaleString('pt-BR',{month:'short'}), num:d.getMonth(), ano:d.getFullYear() } })
  const dadosGrafico = meses.map(m=>({ label:m.label, total:servicos.filter(s=>{const d=new Date(s.criado_em);return d.getMonth()===m.num&&d.getFullYear()===m.ano}).length, concluidos:servicos.filter(s=>{const d=new Date(s.criado_em);return s.status==='concluido'&&d.getMonth()===m.num&&d.getFullYear()===m.ano}).length }))
  const maxGrafico = Math.max(...dadosGrafico.map(d=>d.total),1)
  const servicosFiltrados = filtroStatus==='todos' ? servicos : servicos.filter(s=>s.status===filtroStatus)

  if (loading) return <div style={{textAlign:'center',color:'#8A95A8',padding:80}}>Carregando painel...</div>

  return (
    <div style={{background:'#0A0E1A',minHeight:'100vh',padding:'40px 48px'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{marginBottom:32}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'1.5px',color:'#FF6B35',marginBottom:6}}>Painel</div>
          <h1 style={{fontWeight:800,fontSize:28,color:'#fff'}}>Olá, {usuario?.nome}! 👋</h1>
          {perfil && <div style={{display:'flex',alignItems:'center',gap:12,marginTop:8}}>
            <span style={{color:'#8A95A8',fontSize:14}}>{perfil.categoria} · {perfil.cidade}, {perfil.estado}</span>
            <span style={{background:perfil.disponivel?'rgba(34,197,94,0.15)':'rgba(107,114,128,0.15)',border:`1px solid ${perfil.disponivel?'rgba(34,197,94,0.3)':'rgba(107,114,128,0.3)'}`,color:perfil.disponivel?'#22c55e':'#6b7280',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:50}}>{perfil.disponivel?'● Disponível':'● Indisponível'}</span>
          </div>}
        </div>

        <div style={{display:'flex',gap:4,background:'#111827',padding:4,borderRadius:12,marginBottom:32,width:'fit-content'}}>
          {[{key:'resumo',label:'📊 Resumo'},{key:'servicos',label:`🔧 Serviços${pendentes>0?` (${pendentes})`:''}`},{key:'avaliacoes',label:'⭐ Avaliações'},{key:'perfil',label:'✏️ Meu Perfil'}].map(a=>(
            <button key={a.key} onClick={()=>setAba(a.key as any)} style={{padding:'9px 20px',border:'none',borderRadius:9,cursor:'pointer',background:aba===a.key?'#1a2235':'none',color:aba===a.key?'#fff':'#8A95A8',fontWeight:aba===a.key?600:400,fontSize:14}}>{a.label}</button>
          ))}
        </div>

        {aba==='resumo' && <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:28}}>
            {[{label:'Total',valor:total,icon:'📋',cor:'#3b82f6'},{label:'Concluídos',valor:concluidos,icon:'✅',cor:'#22c55e'},{label:'Pendentes',valor:pendentes,icon:'⏳',cor:'#FFB347'},{label:'Avaliação',valor:perfil?`${perfil.media_avaliacao.toFixed(1)} ★`:'—',icon:'⭐',cor:'#FF6B35'},{label:'Ganhos',valor:ganhos>0?`R$${ganhos.toLocaleString('pt-BR')}`:'—',icon:'💰',cor:'#a78bfa'}].map(m=>(
              <div key={m.label} style={{...card}}><div style={{fontSize:26,marginBottom:8}}>{m.icon}</div><div style={{fontWeight:800,fontSize:24,color:m.cor,marginBottom:4}}>{m.valor}</div><div style={{fontSize:13,color:'#8A95A8'}}>{m.label}</div></div>
            ))}
          </div>
          <div style={{...card}}>
            <div style={{fontWeight:700,fontSize:17,color:'#fff',marginBottom:20}}>📈 Desempenho dos últimos 6 meses</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:16,height:160}}>
              {dadosGrafico.map((d,i)=>(
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                  <div style={{fontSize:11,color:'#8A95A8'}}>{d.total}</div>
                  <div style={{width:'100%',display:'flex',gap:3,alignItems:'flex-end',height:120}}>
                    <div style={{flex:1,background:'rgba(59,130,246,0.3)',borderRadius:'4px 4px 0 0',height:`${(d.total/maxGrafico)*100}%`,minHeight:d.total>0?4:0}} />
                    <div style={{flex:1,background:'#22c55e',borderRadius:'4px 4px 0 0',height:`${(d.concluidos/maxGrafico)*100}%`,minHeight:d.concluidos>0?4:0}} />
                  </div>
                  <div style={{fontSize:12,color:'#8A95A8',textTransform:'capitalize'}}>{d.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:20,marginTop:14}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:12,height:12,background:'rgba(59,130,246,0.5)',borderRadius:2}}/><span style={{fontSize:12,color:'#8A95A8'}}>Total</span></div>
              <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:12,height:12,background:'#22c55e',borderRadius:2}}/><span style={{fontSize:12,color:'#8A95A8'}}>Concluídos</span></div>
            </div>
          </div>
          {pendentes>0 && <div style={{...card,marginTop:20}}>
            <div style={{fontWeight:700,fontSize:17,color:'#fff',marginBottom:16}}>⏳ Solicitações pendentes</div>
            {servicos.filter(s=>s.status==='pendente').slice(0,3).map(s=>(
              <div key={s.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                <div><div style={{fontWeight:600,color:'#fff',marginBottom:2}}>{s.titulo}</div><div style={{fontSize:13,color:'#8A95A8'}}>Cliente: {s.cliente_nome||'—'}</div></div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>mudarStatus(s.id,'aceito')} disabled={atualizandoId===s.id} style={{padding:'7px 16px',background:'#22c55e',color:'#fff',border:'none',borderRadius:50,fontSize:13,fontWeight:600,cursor:'pointer'}}>Aceitar</button>
                  <button onClick={()=>mudarStatus(s.id,'recusado')} disabled={atualizandoId===s.id} style={{padding:'7px 16px',background:'rgba(239,68,68,0.15)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',borderRadius:50,fontSize:13,cursor:'pointer'}}>Recusar</button>
                </div>
              </div>
            ))}
          </div>}
        </div>}

        {aba==='servicos' && <div>
          <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
            {['todos','pendente','aceito','em_andamento','concluido','cancelado'].map(s=>(
              <button key={s} onClick={()=>setFiltroStatus(s)} style={{padding:'7px 16px',border:`1px solid ${filtroStatus===s?(STATUS_COR[s]||'#FF6B35'):'rgba(255,255,255,0.07)'}`,background:filtroStatus===s?`${STATUS_COR[s]||'#FF6B35'}20`:'#111827',color:filtroStatus===s?(STATUS_COR[s]||'#FF6B35'):'#8A95A8',borderRadius:50,fontSize:13,cursor:'pointer'}}>{s==='todos'?'📋 Todos':STATUS_LABEL[s]}</button>
            ))}
          </div>
          {servicosFiltrados.length===0 ? <div style={{textAlign:'center',color:'#8A95A8',padding:60}}><div style={{fontSize:40,marginBottom:12}}>📭</div><p>Nenhum serviço encontrado.</p></div>
          : <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {servicosFiltrados.map(s=>(
              <div key={s.id} style={{...card,display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                    <span style={{fontWeight:700,fontSize:15,color:'#fff'}}>{s.titulo}</span>
                    <span style={{background:`${STATUS_COR[s.status]}20`,color:STATUS_COR[s.status],border:`1px solid ${STATUS_COR[s.status]}40`,fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:50}}>{STATUS_LABEL[s.status]}</span>
                  </div>
                  <div style={{fontSize:13,color:'#8A95A8'}}>Cliente: {s.cliente_nome||'—'}</div>
                  {s.data_agendada&&<div style={{fontSize:12,color:'#8A95A8',marginTop:4}}>📅 {new Date(s.data_agendada).toLocaleDateString('pt-BR')}</div>}
                  {(s.valor_combinado||s.valor_final)&&<div style={{fontSize:13,color:'#22c55e',marginTop:4,fontWeight:600}}>💰 R${(s.valor_final||s.valor_combinado)?.toLocaleString('pt-BR')}</div>}
                </div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {s.status==='pendente'&&<><button onClick={()=>mudarStatus(s.id,'aceito')} disabled={atualizandoId===s.id} style={{padding:'8px 16px',background:'#22c55e',color:'#fff',border:'none',borderRadius:50,fontSize:13,fontWeight:600,cursor:'pointer'}}>✅ Aceitar</button><button onClick={()=>mudarStatus(s.id,'recusado')} disabled={atualizandoId===s.id} style={{padding:'8px 16px',background:'rgba(239,68,68,0.15)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',borderRadius:50,fontSize:13,cursor:'pointer'}}>🚫 Recusar</button></>}
                  {s.status==='aceito'&&<button onClick={()=>mudarStatus(s.id,'em_andamento')} disabled={atualizandoId===s.id} style={{padding:'8px 16px',background:'rgba(167,139,250,0.15)',color:'#a78bfa',border:'1px solid rgba(167,139,250,0.3)',borderRadius:50,fontSize:13,cursor:'pointer'}}>🔧 Iniciar</button>}
                  {s.status==='em_andamento'&&<button onClick={()=>mudarStatus(s.id,'concluido')} disabled={atualizandoId===s.id} style={{padding:'8px 16px',background:'rgba(34,197,94,0.15)',color:'#22c55e',border:'1px solid rgba(34,197,94,0.3)',borderRadius:50,fontSize:13,cursor:'pointer'}}>🎉 Concluir</button>}
                </div>
              </div>
            ))}
          </div>}
        </div>}

        {aba==='avaliacoes' && <div>
          {perfil&&<div style={{...card,marginBottom:24,display:'flex',alignItems:'center',gap:32}}>
            <div style={{textAlign:'center'}}><div style={{fontWeight:800,fontSize:48,color:'#FFB347'}}>{perfil.media_avaliacao.toFixed(1)}</div><div style={{color:'#FFB347',fontSize:22}}>{'★'.repeat(Math.round(perfil.media_avaliacao))}</div><div style={{color:'#8A95A8',fontSize:13,marginTop:4}}>{perfil.total_avaliacoes} avaliações</div></div>
            <div style={{flex:1}}>{[5,4,3,2,1].map(n=>{const qtd=avaliacoes.filter(a=>Math.round(a.nota)===n).length;const pct=perfil.total_avaliacoes>0?(qtd/perfil.total_avaliacoes)*100:0;return(<div key={n} style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}><span style={{color:'#FFB347',fontSize:13,width:20}}>{n}★</span><div style={{flex:1,height:8,background:'rgba(255,255,255,0.07)',borderRadius:4,overflow:'hidden'}}><div style={{width:`${pct}%`,height:'100%',background:'#FFB347',borderRadius:4}}/></div><span style={{color:'#8A95A8',fontSize:12,width:20}}>{qtd}</span></div>)})}</div>
          </div>}
          {avaliacoes.length===0?<div style={{textAlign:'center',color:'#8A95A8',padding:60}}><div style={{fontSize:40,marginBottom:12}}>⭐</div><p>Nenhuma avaliação recebida ainda.</p></div>
          :<div style={{display:'flex',flexDirection:'column',gap:14}}>
            {avaliacoes.map(av=>(
              <div key={av.id} style={{...card}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <div><div style={{fontWeight:600,color:'#fff',marginBottom:2}}>{av.cliente_nome||'Cliente'}</div><div style={{color:'#8A95A8',fontSize:12}}>{new Date(av.criado_em).toLocaleDateString('pt-BR')}</div></div>
                  <div style={{color:'#FFB347',fontSize:18}}>{'★'.repeat(av.nota)}</div>
                </div>
                {av.comentario&&<p style={{color:'#8A95A8',fontSize:14,fontStyle:'italic',marginBottom:12}}>"{av.comentario}"</p>}
                {av.resposta_profissional?<div style={{background:'rgba(255,107,53,0.05)',border:'1px solid rgba(255,107,53,0.15)',borderRadius:10,padding:'10px 14px'}}><span style={{color:'#FF6B35',fontSize:12,fontWeight:600}}>Sua resposta: </span><span style={{color:'#8A95A8',fontSize:13}}>{av.resposta_profissional}</span></div>
                :respostaId===av.id?<div><textarea value={respostaTexto} onChange={e=>setRespostaTexto(e.target.value)} placeholder="Escreva sua resposta..." style={{...inp,height:70,resize:'none',marginBottom:8}}/><div style={{display:'flex',gap:8}}><button onClick={()=>enviarResposta(av.id)} style={{padding:'8px 18px',background:'#FF6B35',color:'#fff',border:'none',borderRadius:50,fontSize:13,fontWeight:600,cursor:'pointer'}}>Enviar</button><button onClick={()=>setRespostaId(null)} style={{padding:'8px 18px',background:'none',color:'#8A95A8',border:'1px solid rgba(255,255,255,0.1)',borderRadius:50,fontSize:13,cursor:'pointer'}}>Cancelar</button></div></div>
                :<button onClick={()=>{setRespostaId(av.id);setRespostaTexto('')}} style={{padding:'7px 16px',background:'none',color:'#FF6B35',border:'1px solid rgba(255,107,53,0.3)',borderRadius:50,fontSize:13,cursor:'pointer'}}>💬 Responder</button>}
              </div>
            ))}
          </div>}
        </div>}

        {aba==='perfil'&&<div style={{maxWidth:540}}>
          <div style={{...card}}>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 24 }}>✏️ Editar meu perfil</div>
            {/* Cole isso dentro do card da aba perfil, logo após o título "✏️ Editar meu perfil" */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <UploadFotoPerfil
                fotoAtual={perfil?.foto_url}
                nome={`${usuario?.nome} ${usuario?.sobrenome}`}
                tamanho={96}
                onUploadSucesso={(url) => setPerfil((p: any) => p ? { ...p, foto_url: url } : p)}
              />
            </div>
            <form onSubmit={salvarPerfil}>
              <div style={{marginBottom:18}}><label style={lbl}>Descrição</label><textarea value={editForm.descricao} onChange={e=>setEditForm({...editForm,descricao:e.target.value})} style={{...inp,height:100,resize:'none'}} placeholder="Descreva seus serviços..."/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18}}>
                <div><label style={lbl}>Valor/hora (R$)</label><input type="number" value={editForm.preco_hora} onChange={e=>setEditForm({...editForm,preco_hora:e.target.value})} style={inp} placeholder="Ex: 80"/></div>
                <div><label style={lbl}>Valor/visita (R$)</label><input type="number" value={editForm.preco_visita} onChange={e=>setEditForm({...editForm,preco_visita:e.target.value})} style={inp} placeholder="Ex: 120"/></div>
              </div>
              <div style={{marginBottom:24}}><label style={lbl}>Disponibilidade</label>
                <div style={{display:'flex',gap:10}}>
                  {[true,false].map(v=><button key={String(v)} type="button" onClick={()=>setEditForm({...editForm,disponivel:v})} style={{flex:1,padding:10,border:`1px solid ${editForm.disponivel===v?(v?'rgba(34,197,94,0.4)':'rgba(107,114,128,0.4)'):'rgba(255,255,255,0.07)'}`,background:editForm.disponivel===v?(v?'rgba(34,197,94,0.1)':'rgba(107,114,128,0.1)'):'none',color:editForm.disponivel===v?(v?'#22c55e':'#6b7280'):'#8A95A8',borderRadius:10,cursor:'pointer',fontSize:14,fontWeight:500}}>{v?'✅ Disponível':'⛔ Indisponível'}</button>)}
                </div>
              </div>
              {msgSalvo&&<div style={{color:msgSalvo.startsWith('✅')?'#22c55e':'#f87171',fontSize:14,marginBottom:14}}>{msgSalvo}</div>}
              <button type="submit" disabled={salvando} style={{width:'100%',padding:14,background:'#FF6B35',color:'#fff',border:'none',borderRadius:50,fontSize:15,fontWeight:700,cursor:'pointer'}}>{salvando?'Salvando...':'Salvar alterações'}</button>
            </form>
          </div>
        </div>}

      </div>
    </div>
  )
}
