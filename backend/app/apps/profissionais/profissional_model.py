from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class Profissional(Base):
    __tablename__ = "profissionais"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)

    # Dados profissionais
    categoria = Column(String(100), nullable=False, index=True)
    descricao = Column(Text, nullable=True)
    especialidades = Column(String(300), nullable=True)   # separadas por vírgula
    anos_experiencia = Column(Integer, default=0)

    # Localização e disponibilidade
    cidade = Column(String(100), nullable=False, index=True)
    estado = Column(String(2), nullable=False, index=True)
    raio_atendimento_km = Column(Integer, default=10)
    disponivel = Column(Boolean, default=True)

    # Precificação
    preco_hora = Column(Float, nullable=True)
    preco_visita = Column(Float, nullable=True)

    # Avaliação — atualizado automaticamente pelo service de avaliações
    media_avaliacao = Column(Float, default=0.0)
    total_avaliacoes = Column(Integer, default=0)
    total_servicos = Column(Integer, default=0)

    # Verificação
    verificado = Column(Boolean, default=False)
    foto_url = Column(String(300), nullable=True)

    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    usuario = relationship("Usuario", backref="perfil_profissional")
    avaliacoes = relationship("Avaliacao", back_populates="profissional")

    def __repr__(self):
        return f"<Profissional id={self.id} categoria={self.categoria}>"
