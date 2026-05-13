from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.apps.usuarios.usuario_model import TipoUsuario


class UsuarioCriar(BaseModel):
    nome: str
    sobrenome: str
    email: EmailStr
    telefone: Optional[str] = None
    senha: str
    tipo: TipoUsuario
    cidade: Optional[str] = None
    estado: Optional[str] = None


class UsuarioAtualizar(BaseModel):
    nome: Optional[str] = None
    sobrenome: Optional[str] = None
    telefone: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None


class UsuarioResposta(BaseModel):
    id: int
    nome: str
    sobrenome: str
    email: EmailStr
    telefone: Optional[str]
    tipo: TipoUsuario
    cidade: Optional[str]
    estado: Optional[str]
    ativo: bool
    criado_em: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


class TokenResposta(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResposta
