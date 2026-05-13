from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AvaliacaoCriar(BaseModel):
    profissional_id: int
    nota: float = Field(..., ge=1.0, le=5.0, description="Nota de 1 a 5")
    comentario: Optional[str] = None


class RespostaProfissional(BaseModel):
    resposta: str


class AvaliacaoResposta(BaseModel):
    id: int
    profissional_id: int
    cliente_id: int
    nota: float
    comentario: Optional[str]
    resposta_profissional: Optional[str]
    criado_em: datetime
    respondido_em: Optional[datetime]
    # Dados do cliente embutidos
    cliente_nome: Optional[str] = None

    class Config:
        from_attributes = True
