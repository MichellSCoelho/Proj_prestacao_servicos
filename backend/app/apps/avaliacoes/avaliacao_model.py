from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    __table_args__ = (
        CheckConstraint("nota >= 1 AND nota <= 5", name="nota_valida"),
    )

    id = Column(Integer, primary_key=True, index=True)
    profissional_id = Column(Integer, ForeignKey("profissionais.id"), nullable=False, index=True)
    cliente_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)

    nota = Column(Float, nullable=False)               # 1.0 a 5.0
    comentario = Column(Text, nullable=True)
    resposta_profissional = Column(Text, nullable=True)  # profissional pode responder

    criado_em = Column(DateTime, default=datetime.utcnow)
    respondido_em = Column(DateTime, nullable=True)

    # Relacionamentos
    profissional = relationship("Profissional", back_populates="avaliacoes")
    cliente = relationship("Usuario", foreign_keys=[cliente_id])

    def __repr__(self):
        return f"<Avaliacao id={self.id} nota={self.nota} profissional={self.profissional_id}>"
