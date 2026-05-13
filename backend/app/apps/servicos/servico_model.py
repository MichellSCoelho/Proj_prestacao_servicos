import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base


class StatusServico(str, enum.Enum):
    pendente = "pendente"         # cliente solicitou
    aceito = "aceito"             # profissional aceitou
    em_andamento = "em_andamento" # serviço iniciado
    concluido = "concluido"       # serviço finalizado
    cancelado = "cancelado"       # cancelado por qualquer parte
    recusado = "recusado"         # profissional recusou


class Servico(Base):
    __tablename__ = "servicos"

    id = Column(Integer, primary_key=True, index=True)

    # Partes envolvidas
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False, index=True)
    profissional_id = Column(Integer, ForeignKey("profissionais.id"), nullable=False, index=True)

    # Detalhes do serviço
    titulo = Column(String(150), nullable=False)
    descricao = Column(Text, nullable=True)
    categoria = Column(String(100), nullable=False)
    endereco_servico = Column(String(300), nullable=True)
    cidade = Column(String(100), nullable=True)
    estado = Column(String(2), nullable=True)

    # Agendamento
    data_agendada = Column(DateTime, nullable=True)
    data_inicio = Column(DateTime, nullable=True)
    data_conclusao = Column(DateTime, nullable=True)

    # Financeiro
    valor_combinado = Column(Float, nullable=True)
    valor_final = Column(Float, nullable=True)

    # Status e histórico
    status = Column(Enum(StatusServico), default=StatusServico.pendente, nullable=False, index=True)
    motivo_cancelamento = Column(Text, nullable=True)

    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    cliente = relationship("Cliente", back_populates="solicitacoes")
    profissional = relationship("Profissional")

    def __repr__(self):
        return f"<Servico id={self.id} status={self.status} titulo={self.titulo}>"