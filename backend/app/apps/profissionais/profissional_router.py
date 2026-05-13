from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_usuario_atual
from app.apps.profissionais.profissional_schema import (
    ProfissionalCriar, ProfissionalAtualizar, ProfissionalResposta
)
from app.apps.profissionais import profissional_service

router = APIRouter(prefix="/profissionais", tags=["Profissionais"])


@router.get("", summary="Buscar e listar profissionais")
def listar_profissionais(
    categoria: Optional[str] = Query(None),
    cidade: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    termo: Optional[str] = Query(None, description="Busca por descrição ou especialidade"),
    apenas_verificados: bool = Query(False),
    disponivel: Optional[bool] = Query(None),
    ordem: str = Query("avaliacao", description="avaliacao | preco | recente"),
    pagina: int = Query(1, ge=1),
    tamanho: int = Query(12, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return profissional_service.buscar_profissionais(
        db, categoria, cidade, estado, termo,
        apenas_verificados, disponivel, ordem, pagina, tamanho
    )


@router.get("/{profissional_id}", response_model=ProfissionalResposta, summary="Perfil detalhado")
def detalhe_profissional(profissional_id: int, db: Session = Depends(get_db)):
    return profissional_service.buscar_profissional_por_id(db, profissional_id)


@router.post("", response_model=ProfissionalResposta, status_code=201, summary="Criar perfil profissional")
def criar_perfil(
    dados: ProfissionalCriar,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    return profissional_service.criar_perfil_profissional(db, dados, usuario_atual.id)


@router.put("/me", response_model=ProfissionalResposta, summary="Atualizar meu perfil profissional")
def atualizar_perfil(
    dados: ProfissionalAtualizar,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    return profissional_service.atualizar_perfil(db, usuario_atual.id, dados)
