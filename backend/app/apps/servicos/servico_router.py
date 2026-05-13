from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_usuario_atual
from app.apps.servicos.servico_model import StatusServico
from app.apps.servicos.servico_schema import ServicoCriar, ServicoMudarStatus, ServicoResposta
from app.apps.servicos import servico_service

router = APIRouter(prefix="/servicos", tags=["Serviços"])


@router.post("", response_model=ServicoResposta, status_code=201, summary="Solicitar serviço")
def solicitar_servico(
    dados: ServicoCriar,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """Cliente solicita um serviço a um profissional."""
    return servico_service.criar_servico(db, dados, usuario_atual)


@router.get("", summary="Listar meus serviços")
def listar_meus_servicos(
    status: Optional[StatusServico] = Query(None, description="Filtrar por status"),
    pagina: int = Query(1, ge=1),
    tamanho: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """Lista serviços do usuário autenticado (cliente ou profissional)."""
    return servico_service.listar_servicos_do_usuario(db, usuario_atual, status, pagina, tamanho)


@router.get("/{servico_id}", response_model=ServicoResposta, summary="Detalhe do serviço")
def detalhe_servico(
    servico_id: int,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """Retorna os detalhes de um serviço (somente para as partes envolvidas)."""
    return servico_service.buscar_servico_por_id(db, servico_id, usuario_atual)


@router.patch("/{servico_id}/status", response_model=ServicoResposta, summary="Atualizar status do serviço")
def atualizar_status(
    servico_id: int,
    dados: ServicoMudarStatus,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """
    Atualiza o status de um serviço seguindo o fluxo:

    pendente → aceito / recusado / cancelado

    aceito → em_andamento / cancelado

    em_andamento → concluido / cancelado
    """
    return servico_service.mudar_status(db, servico_id, dados, usuario_atual)