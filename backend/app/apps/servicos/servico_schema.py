from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.apps.servicos.servico_model import StatusServico


class ServicoCriar(BaseModel):
    profissional_id: int
    titulo: str
    descricao: Optional[str] = None
    categoria: str
    endereco_servico: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    data_agendada: Optional[datetime] = None
    valor_combinado: Optional[float] = None


class ServicoAtualizar(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    endereco_servico: Optional[str] = None
    data_agendada: Optional[datetime] = None
    valor_combinado: Optional[float] = None


class ServicoMudarStatus(BaseModel):
    status: StatusServico
    motivo_cancelamento: Optional[str] = None
    valor_final: Optional[float] = None


class ServicoResposta(BaseModel):
    id: int
    cliente_id: int
    profissional_id: int
    titulo: str
    descricao: Optional[str]
    categoria: str
    endereco_servico: Optional[str]
    cidade: Optional[str]
    estado: Optional[str]
    data_agendada: Optional[datetime]
    data_inicio: Optional[datetime]
    data_conclusao: Optional[datetime]
    valor_combinado: Optional[float]
    valor_final: Optional[float]
    status: StatusServico
    motivo_cancelamento: Optional[str]
    criado_em: datetime
    atualizado_em: datetime
    # Dados resumidos das partes
    cliente_nome: Optional[str] = None
    profissional_nome: Optional[str] = None
    profissional_categoria: Optional[str] = None

    class Config:
        from_attributes = True