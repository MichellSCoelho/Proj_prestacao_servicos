from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_usuario_atual
from app.apps.avaliacoes.avaliacao_schema import (
    AvaliacaoCriar, RespostaProfissional, AvaliacaoResposta
)
from app.apps.avaliacoes import avaliacao_service

router = APIRouter(prefix="/avaliacoes", tags=["Avaliações"])


@router.post("", response_model=AvaliacaoResposta, status_code=201, summary="Avaliar profissional")
def avaliar(
    dados: AvaliacaoCriar,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    return avaliacao_service.criar_avaliacao(db, dados, usuario_atual.id)


@router.get("/profissional/{profissional_id}", summary="Avaliações de um profissional")
def listar(
    profissional_id: int,
    pagina: int = Query(1, ge=1),
    tamanho: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return avaliacao_service.listar_avaliacoes_do_profissional(db, profissional_id, pagina, tamanho)


@router.post("/{avaliacao_id}/resposta", response_model=AvaliacaoResposta, summary="Profissional responde avaliação")
def responder(
    avaliacao_id: int,
    dados: RespostaProfissional,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    return avaliacao_service.responder_avaliacao(db, avaliacao_id, dados, usuario_atual.id)
