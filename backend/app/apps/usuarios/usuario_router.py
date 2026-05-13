from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_usuario_atual
from app.apps.usuarios.usuario_schema import (
    UsuarioCriar, UsuarioAtualizar, UsuarioResposta, LoginRequest, TokenResposta
)
from app.apps.usuarios import usuario_service

router = APIRouter()


@router.post("/auth/cadastro", response_model=UsuarioResposta, status_code=201, tags=["Auth"])
def cadastrar(dados: UsuarioCriar, db: Session = Depends(get_db)):
    """Cadastra novo cliente ou profissional."""
    return usuario_service.criar_usuario(db, dados)


@router.post("/auth/login", response_model=TokenResposta, tags=["Auth"])
def login(dados: LoginRequest, db: Session = Depends(get_db)):
    """Autentica e retorna JWT + dados do usuário."""
    return usuario_service.autenticar_usuario(db, dados.email, dados.senha)


@router.get("/usuarios/me", response_model=UsuarioResposta, tags=["Usuários"])
def meu_perfil(usuario_atual=Depends(get_usuario_atual)):
    """Retorna dados do usuário autenticado."""
    return usuario_atual


@router.put("/usuarios/me", response_model=UsuarioResposta, tags=["Usuários"])
def atualizar_meu_perfil(
    dados: UsuarioAtualizar,
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """Atualiza dados do usuário autenticado."""
    return usuario_service.atualizar_usuario(db, usuario_atual.id, dados)


@router.delete("/usuarios/me", tags=["Usuários"])
def desativar_minha_conta(
    db: Session = Depends(get_db),
    usuario_atual=Depends(get_usuario_atual),
):
    """Desativa a conta do usuário autenticado."""
    return usuario_service.desativar_usuario(db, usuario_atual.id)
