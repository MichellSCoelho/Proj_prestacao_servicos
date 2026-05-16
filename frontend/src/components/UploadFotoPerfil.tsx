import { useState, useRef } from 'react'
import api from '../api/axios'

interface Props { fotoAtual?: string; nome?: string; onUploadSucesso?: (url: string) => void; tamanho?: number }

export default function UploadFotoPerfil({ fotoAtual, nome, onUploadSucesso, tamanho = 80 }: Props) {
  const [preview, setPreview] = useState<string|null>(fotoAtual||null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(''); const [erro, setErro] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const iniciais = nome ? nome.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() : '?'

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { setErro('Formato inválido. Use JPEG, PNG ou WEBP.'); return }
    if (file.size > 5*1024*1024) { setErro('Arquivo muito grande. Máximo 5MB.'); return }
    const reader = new FileReader(); reader.onload = () => setPreview(reader.result as string); reader.readAsDataURL(file)
    setErro(''); setMsg(''); setLoading(true)
    try {
      const formData = new FormData(); formData.append('file', file)
      const { data } = await api.post('/upload/foto-perfil', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('✅ Foto atualizada!'); setPreview(data.foto_url); onUploadSucesso?.(data.foto_url)
    } catch(err: any) { setErro(err.response?.data?.detail||'Erro ao enviar foto.'); setPreview(fotoAtual||null) }
    finally { setLoading(false); if (inputRef.current) inputRef.current.value = '' }
  }

  async function handleRemover() {
    setLoading(true)
    try { await api.delete('/upload/foto-perfil'); setPreview(null); setMsg('Foto removida.'); onUploadSucesso?.('') }
    catch { setErro('Erro ao remover foto.') } finally { setLoading(false) }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
      <div style={{ position:'relative' }}>
        <div onClick={() => inputRef.current?.click()} style={{ width:tamanho, height:tamanho, borderRadius:'50%', background:preview?'transparent':'linear-gradient(135deg,#FF6B35,#FFB347)', border:'3px solid rgba(255,107,53,0.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', overflow:'hidden' }}>
          {preview ? <img src={preview} alt="Foto" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontWeight:800, fontSize:tamanho*0.35, color:'#fff' }}>{iniciais}</span>}
        </div>
        <button onClick={() => inputRef.current?.click()} disabled={loading} style={{ position:'absolute', bottom:0, right:0, width:28, height:28, borderRadius:'50%', background:'#FF6B35', border:'2px solid #0A0E1A', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13 }}>
          {loading?'⏳':'📷'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={handleChange} />
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={() => inputRef.current?.click()} disabled={loading} style={{ padding:'6px 14px', background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.3)', color:'#FF6B35', borderRadius:50, fontSize:12, fontWeight:600, cursor:'pointer' }}>{loading?'Enviando...':'📷 Alterar foto'}</button>
        {preview && <button onClick={handleRemover} disabled={loading} style={{ padding:'6px 14px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', borderRadius:50, fontSize:12, cursor:'pointer' }}>🗑️ Remover</button>}
      </div>
      {msg && <div style={{ color:'#22c55e', fontSize:12 }}>{msg}</div>}
      {erro && <div style={{ color:'#fca5a5', fontSize:12 }}>{erro}</div>}
      <div style={{ color:'#8A95A8', fontSize:11 }}>JPEG, PNG ou WEBP · máx. 5MB</div>
    </div>
  )
}
