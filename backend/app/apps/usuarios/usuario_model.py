import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from app.core.database import Base


class TipoUsuario(str, enum.Enum):
    cliente = "cliente"
    profissional = "profissional"


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    sobrenome = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    telefone = Column(String(20), nullable=True)
    senha_hash = Column(String(255), nullable=False)
    tipo = Column(Enum(TipoUsuario), nullable=False)
    cidade = Column(String(100), nullable=True)
    estado = Column(String(2), nullable=True)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Usuario id={self.id} email={self.email} tipo={self.tipo}>"
