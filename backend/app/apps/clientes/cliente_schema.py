from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ClienteCriar(BaseModel):
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: str
    estado: str
    observacoes: Optional[str] = None


class ClienteAtualizar(BaseModel):
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    observacoes: Optional[str] = None


class ClienteResposta(BaseModel):
    id: int
    usuario_id: int
    cep: Optional[str]
    logradouro: Optional[str]
    numero: Optional[str]
    complemento: Optional[str]
    bairro: Optional[str]
    cidade: str
    estado: str
    observacoes: Optional[str]
    criado_em: datetime
    # Dados do usuário embutidos
    nome: Optional[str] = None
    sobrenome: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None

    class Config:
        from_attributes = True