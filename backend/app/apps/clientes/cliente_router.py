from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_usuario_atual
from app.apps.clientes.cliente_schema import ClienteCriar, ClienteAtualizar, ClienteResposta
from app.apps.clientes import cliente_service

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.post("", response_model=ClienteResposta, status_code=201, summary="Criar perfil de cliente")
def criar_perfil(
    dados: ClienteCriar,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """Cria o perfil de endereço e preferências do cliente autenticado."""
    return cliente_service.criar_perfil_cliente(db, dados, usuario_atual.id)


@router.get("/me", response_model=ClienteResposta, summary="Meu perfil de cliente")
def meu_perfil(
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """Retorna o perfil completo do cliente autenticado."""
    return cliente_service.buscar_cliente_por_usuario(db, usuario_atual.id)


@router.put("/me", response_model=ClienteResposta, summary="Atualizar meu perfil de cliente")
def atualizar_perfil(
    dados: ClienteAtualizar,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """Atualiza endereço e preferências do cliente autenticado."""
    return cliente_service.atualizar_perfil_cliente(db, usuario_atual.id, dados)


@router.get("/{cliente_id}", response_model=ClienteResposta, summary="Buscar cliente por ID")
def buscar_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_usuario_atual),
):
    """Retorna dados de um cliente pelo ID (apenas para usuários autenticados)."""
    return cliente_service.buscar_cliente_por_id(db, cliente_id)