from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.apps.avaliacoes.avaliacao_model import Avaliacao
from app.apps.avaliacoes.avaliacao_schema import AvaliacaoCriar, RespostaProfissional
from app.apps.profissionais.profissional_model import Profissional
from app.apps.usuarios.usuario_model import TipoUsuario


def criar_avaliacao(db: Session, dados: AvaliacaoCriar, cliente_id: int) -> Avaliacao:
    # Somente clientes podem avaliar
    from app.apps.usuarios.usuario_model import Usuario
    cliente = db.query(Usuario).filter(Usuario.id == cliente_id).first()
    if not cliente or cliente.tipo != TipoUsuario.cliente:
        raise HTTPException(status_code=403, detail="Apenas clientes podem avaliar profissionais.")

    profissional = db.query(Profissional).filter(Profissional.id == dados.profissional_id).first()
    if not profissional:
        raise HTTPException(status_code=404, detail="Profissional não encontrado.")

    # Impede avaliação duplicada do mesmo cliente ao mesmo profissional
    ja_avaliou = db.query(Avaliacao).filter(
        Avaliacao.profissional_id == dados.profissional_id,
        Avaliacao.cliente_id == cliente_id,
    ).first()
    if ja_avaliou:
        raise HTTPException(status_code=400, detail="Você já avaliou este profissional.")

    avaliacao = Avaliacao(
        profissional_id=dados.profissional_id,
        cliente_id=cliente_id,
        nota=dados.nota,
        comentario=dados.comentario,
    )
    db.add(avaliacao)
    db.flush()

    # Recalcular média do profissional
    _recalcular_media(db, dados.profissional_id)

    db.commit()
    db.refresh(avaliacao)
    return _enriquecer(avaliacao, db)


def listar_avaliacoes_do_profissional(
    db: Session, profissional_id: int, pagina: int = 1, tamanho: int = 10
) -> dict:
    query = db.query(Avaliacao).filter(Avaliacao.profissional_id == profissional_id)
    total = query.count()
    avaliacoes = (
        query.order_by(Avaliacao.criado_em.desc())
        .offset((pagina - 1) * tamanho)
        .limit(tamanho)
        .all()
    )
    return {
        "total": total,
        "pagina": pagina,
        "tamanho": tamanho,
        "avaliacoes": [_enriquecer(a, db) for a in avaliacoes],
    }


def responder_avaliacao(
    db: Session, avaliacao_id: int, dados: RespostaProfissional, usuario_id: int
) -> Avaliacao:
    avaliacao = db.query(Avaliacao).filter(Avaliacao.id == avaliacao_id).first()
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada.")

    profissional = db.query(Profissional).filter(Profissional.usuario_id == usuario_id).first()
    if not profissional or profissional.id != avaliacao.profissional_id:
        raise HTTPException(status_code=403, detail="Você não pode responder esta avaliação.")

    avaliacao.resposta_profissional = dados.resposta
    avaliacao.respondido_em = datetime.utcnow()
    db.commit()
    db.refresh(avaliacao)
    return _enriquecer(avaliacao, db)


def _recalcular_media(db: Session, profissional_id: int):
    resultado = db.query(
        func.avg(Avaliacao.nota).label("media"),
        func.count(Avaliacao.id).label("total"),
    ).filter(Avaliacao.profissional_id == profissional_id).first()

    profissional = db.query(Profissional).filter(Profissional.id == profissional_id).first()
    if profissional:
        profissional.media_avaliacao = round(resultado.media or 0.0, 1)
        profissional.total_avaliacoes = resultado.total or 0


def _enriquecer(avaliacao: Avaliacao, db: Session) -> Avaliacao:
    if avaliacao.cliente:
        avaliacao.cliente_nome = f"{avaliacao.cliente.nome} {avaliacao.cliente.sobrenome}"
    return avaliacao
