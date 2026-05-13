from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ProfissionalCriar(BaseModel):
    categoria: str
    descricao: Optional[str] = None
    especialidades: Optional[str] = None
    anos_experiencia: Optional[int] = 0
    cidade: str
    estado: str
    raio_atendimento_km: Optional[int] = 10
    preco_hora: Optional[float] = None
    preco_visita: Optional[float] = None
    foto_url: Optional[str] = None


class ProfissionalAtualizar(BaseModel):
    categoria: Optional[str] = None
    descricao: Optional[str] = None
    especialidades: Optional[str] = None
    anos_experiencia: Optional[int] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    raio_atendimento_km: Optional[int] = None
    preco_hora: Optional[float] = None
    preco_visita: Optional[float] = None
    disponivel: Optional[bool] = None
    foto_url: Optional[str] = None


class ProfissionalResposta(BaseModel):
    id: int
    usuario_id: int
    categoria: str
    descricao: Optional[str]
    especialidades: Optional[str]
    anos_experiencia: int
    cidade: str
    estado: str
    raio_atendimento_km: int
    disponivel: bool
    preco_hora: Optional[float]
    preco_visita: Optional[float]
    media_avaliacao: float
    total_avaliacoes: int
    total_servicos: int
    verificado: bool
    foto_url: Optional[str]
    criado_em: datetime
    # Dados do usuário embutidos na resposta
    nome: Optional[str] = None
    sobrenome: Optional[str] = None
    telefone: Optional[str] = None

    class Config:
        from_attributes = True


class ProfissionalListagem(BaseModel):
    """Schema reduzido para listagem/busca."""
    id: int
    usuario_id: int
    categoria: str
    descricao: Optional[str]
    cidade: str
    estado: str
    preco_hora: Optional[float]
    preco_visita: Optional[float]
    media_avaliacao: float
    total_avaliacoes: int
    verificado: bool
    disponivel: bool
    foto_url: Optional[str]
    nome: Optional[str] = None
    sobrenome: Optional[str] = None

    class Config:
        from_attributes = True
