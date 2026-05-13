from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)

    # Endereço
    cep = Column(String(10), nullable=True)
    logradouro = Column(String(200), nullable=True)
    numero = Column(String(10), nullable=True)
    complemento = Column(String(100), nullable=True)
    bairro = Column(String(100), nullable=True)
    cidade = Column(String(100), nullable=False, index=True)
    estado = Column(String(2), nullable=False, index=True)

    # Preferências
    observacoes = Column(Text, nullable=True)

    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    usuario = relationship("Usuario", backref="perfil_cliente")
    solicitacoes = relationship("Servico", back_populates="cliente")

    def __repr__(self):
        return f"<Cliente id={self.id} usuario_id={self.usuario_id}>"