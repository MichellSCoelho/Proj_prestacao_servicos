import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_usuario_atual
from app.core.config import settings
from app.apps.usuarios.usuario_model import Usuario
from app.apps.profissionais.profissional_model import Profissional

router = APIRouter(prefix="/upload", tags=["Upload"])

cloudinary.config(cloud_name=settings.CLOUDINARY_CLOUD_NAME, api_key=settings.CLOUDINARY_API_KEY, api_secret=settings.CLOUDINARY_API_SECRET, secure=True)

@router.post("/foto-perfil")
async def upload_foto(file: UploadFile = File(...), db: Session = Depends(get_db), usuario_atual: Usuario = Depends(get_usuario_atual)):
    if file.content_type not in {"image/jpeg","image/png","image/webp","image/jpg"}:
        raise HTTPException(status_code=400, detail="Formato inválido. Use JPEG, PNG ou WEBP.")
    conteudo = await file.read()
    if len(conteudo) > 5*1024*1024:
        raise HTTPException(status_code=400, detail="Arquivo muito grande. Máximo 5MB.")
    try:
        resultado = cloudinary.uploader.upload(conteudo, folder="meuprestador/fotos_perfil", public_id=f"usuario_{usuario_atual.id}", overwrite=True, transformation=[{"width":400,"height":400,"crop":"fill","gravity":"face"},{"quality":"auto","fetch_format":"auto"}])
        foto_url = resultado["secure_url"]
        if usuario_atual.tipo == "profissional":
            perfil = db.query(Profissional).filter(Profissional.usuario_id==usuario_atual.id).first()
            if perfil:
                perfil.foto_url = foto_url
                db.commit()
        return {"mensagem":"Foto enviada com sucesso!","foto_url":foto_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.delete("/foto-perfil")
async def remover_foto(db: Session = Depends(get_db), usuario_atual: Usuario = Depends(get_usuario_atual)):
    try:
        cloudinary.uploader.destroy(f"meuprestador/fotos_perfil/usuario_{usuario_atual.id}")
        if usuario_atual.tipo == "profissional":
            perfil = db.query(Profissional).filter(Profissional.usuario_id==usuario_atual.id).first()
            if perfil:
                perfil.foto_url = None
                db.commit()
        return {"mensagem":"Foto removida."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")
