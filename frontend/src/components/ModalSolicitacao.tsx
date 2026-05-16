import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface Props { profissionalId: number; profissionalNome: string; categoria: string; precoHora?: number; onClose: () => void }
const inp: React.CSSProperties = { width:'100%', background:'#0A0E1A', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'11px 14px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:11, fontWeight:600, color:'#8A95A8', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }
const overlay: React.CSSProperties = { position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }
const modal: React.CSSProperties = { background:'#111827', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'32px 36px', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto' }

export default function ModalSolicitacao({ profissionalId, profissionalNome, categoria, precoHora, onClose }: Props) {
  const { isLogado, usuario } = useAuth()
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'servico'|'orcamento'>('servico')
  const [form, setForm] = useState({ titulo:'', descricao:'', data_agendada:'', hora_agendada:'', endereco_servico:'', cidade:'', estado:'AM', valor_combinado:'' })
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')
  const set = (c: string, v: string) => setForm(f => ({...f, [c]:v}))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLogado) { navigate('/login'); return }
    if (usuario?.tipo !== 'cliente') { setErro('Apenas clientes podem solicitar serviços.'); return }
    setErro(''); setLoading(true)
    try {
      try { await api.get('/clientes/me') } catch { await api.post('/clientes', { cidade: form.cidade||'Manaus', estado: form.estado||'AM' }) }
      let dataAgendada = undefined
      if (form.data_agendada) dataAgendada = `${form.data_agendada}T${form.hora_agendada||'08:00'}:00`
      await api.post('/servicos', {
        profissional_id: profissionalId,
        titulo: tipo==='orcamento' ? `[ORÇAMENTO] ${form.titulo||categoria}` : form.titulo,
        descricao: form.descricao, categoria,
        endereco_servico: form.endereco_servico,
        cidade: form.cidade||'Manaus', estado: form.estado||'AM',
        data_agendada: dataAgendada,
        valor_combinado: form.valor_combinado ? Number(form.valor_combinado) : undefined,
      })
      setSucesso(true)
    } catch(err: any) { setErro(err.response?.data?.detail||'Erro ao enviar. Tente novamente.') }
    finally { setLoading(false) }
  }

  if (sucesso) return (
    <div style={overlay} onClick={onClose}>
      <div style={{...modal, textAlign:'center'}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:56, marginBottom:16}}>🎉</div>
        <h3 style={{fontWeight:800, fontSize:22, color:'#fff', marginBottom:8}}>{tipo==='orcamento'?'Orçamento solicitado!':'Serviço solicitado!'}</h3>
        <p style={{color:'#8A95A8', fontSize:15, lineHeight:1.6, marginBottom:8}}>Solicitação enviada para <strong style={{color:'#FF6B35'}}>{profissionalNome}</strong>.</p>
        <p style={{color:'#8A95A8', fontSize:14, marginBottom:28}}>Aguarde a confirmação do profissional.</p>
        <button onClick={onClose} style={{padding:'12px 32px', background:'#FF6B35', color:'#fff', border:'none', borderRadius:50, fontSize:15, fontWeight:700, cursor:'pointer'}}>Fechar</button>
      </div>
    </div>
  )

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24}}>
          <div>
            <h3 style={{fontWeight:800, fontSize:20, color:'#fff', marginBottom:2}}>Solicitar serviço</h3>
            <p style={{color:'#8A95A8', fontSize:13}}>Para: <span style={{color:'#FF6B35', fontWeight:600}}>{profissionalNome}</span> · {categoria}</p>
          </div>
          <button onClick={onClose} style={{width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'none', color:'#8A95A8', fontSize:18, cursor:'pointer'}}>✕</button>
        </div>
        {!isLogado && <div style={{background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.25)', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:14, color:'#FFB347'}}>Você precisa estar logado como cliente. <span onClick={()=>navigate('/login')} style={{color:'#FF6B35', fontWeight:600, cursor:'pointer', textDecoration:'underline'}}>Fazer login</span></div>}
        <div style={{display:'flex', gap:4, background:'#0A0E1A', padding:4, borderRadius:10, marginBottom:24}}>
          {([{key:'servico',label:'🔧 Contratar serviço'},{key:'orcamento',label:'💰 Solicitar orçamento'}] as const).map(t=>(
            <button key={t.key} onClick={()=>setTipo(t.key)} style={{flex:1, padding:10, border:'none', borderRadius:8, cursor:'pointer', background:tipo===t.key?'#1a2235':'none', color:tipo===t.key?'#fff':'#8A95A8', fontWeight:tipo===t.key?600:400, fontSize:14, borderBottom:tipo===t.key?'2px solid #FF6B35':'2px solid transparent'}}>{t.label}</button>
          ))}
        </div>
        {erro && <div style={{background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.3)', color:'#fca5a5', padding:'10px 14px', borderRadius:10, fontSize:14, marginBottom:18}}>{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}><label style={lbl}>Título do serviço *</label><input required style={inp} placeholder={tipo==='orcamento'?'Ex: Orçamento para instalação elétrica':'Ex: Instalação de tomadas'} value={form.titulo} onChange={e=>set('titulo',e.target.value)} /></div>
          <div style={{marginBottom:16}}><label style={lbl}>Descrição detalhada *</label><textarea required style={{...inp, height:90, resize:'none'}} placeholder="Descreva o que precisa ser feito..." value={form.descricao} onChange={e=>set('descricao',e.target.value)} /></div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16}}>
            <div><label style={lbl}>Data desejada</label><input type="date" style={inp} min={new Date().toISOString().split('T')[0]} value={form.data_agendada} onChange={e=>set('data_agendada',e.target.value)} /></div>
            <div><label style={lbl}>Horário</label><input type="time" style={inp} value={form.hora_agendada} onChange={e=>set('hora_agendada',e.target.value)} /></div>
          </div>
          <div style={{marginBottom:16}}><label style={lbl}>Endereço do serviço</label><input style={inp} placeholder="Ex: Rua das Flores, 123 - Bairro" value={form.endereco_servico} onChange={e=>set('endereco_servico',e.target.value)} /></div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16}}>
            <div><label style={lbl}>Cidade</label><input style={inp} placeholder="Manaus" value={form.cidade} onChange={e=>set('cidade',e.target.value)} /></div>
            <div><label style={lbl}>Estado</label><input style={inp} placeholder="AM" maxLength={2} value={form.estado} onChange={e=>set('estado',e.target.value.toUpperCase())} /></div>
          </div>
          {tipo==='servico' && <div style={{marginBottom:16}}><label style={lbl}>Valor combinado (R$){precoHora&&<span style={{color:'#8A95A8', fontWeight:400, marginLeft:8, textTransform:'none', letterSpacing:0}}>— profissional cobra R${precoHora}/h</span>}</label><input type="number" style={inp} placeholder="Deixe em branco para combinar diretamente" value={form.valor_combinado} onChange={e=>set('valor_combinado',e.target.value)} /></div>}
          {tipo==='orcamento' && <div style={{background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#93c5fd'}}>💡 O profissional entrará em contato com um orçamento antes de iniciar.</div>}
          <button type="submit" disabled={loading||!isLogado} style={{width:'100%', padding:14, background:isLogado?'#FF6B35':'rgba(255,107,53,0.4)', color:'#fff', border:'none', borderRadius:50, fontSize:15, fontWeight:700, cursor:isLogado?'pointer':'not-allowed', marginTop:8}}>
            {loading?'Enviando...':tipo==='orcamento'?'💰 Solicitar orçamento':'🔧 Confirmar solicitação'}
          </button>
        </form>
      </div>
    </div>
  )
}
