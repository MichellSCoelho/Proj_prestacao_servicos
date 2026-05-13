from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.apps.servicos.servico_model import Servico, StatusServico
from app.apps.servicos.servico_schema import ServicoCriar, ServicoAtualizar, ServicoMudarStatus
from app.apps.clientes.cliente_model import Cliente
from app.apps.profissionais.profissional_model import Profissional
from app.apps.usuarios.usuario_model import TipoUsuario

# Transições de status permitidas
TRANSICOES_VALIDAS = {
    StatusServico.pendente:     [StatusServico.aceito, StatusServico.recusado, StatusServico.cancelado],
    StatusServico.aceito:       [StatusServico.em_andamento, StatusServico.cancelado],
    StatusServico.em_andamento: [StatusServico.concluido, StatusServico.cancelado],
    StatusServico.concluido:    [],
    StatusServico.cancelado:    [],
    StatusServico.recusado:     [],
}


def criar_servico(db: Session, dados: ServicoCriar, usuario_atual) -> Servico:
    if usuario_atual.tipo != TipoUsuario.cliente:
        raise HTTPException(status_code=403, detail="Apenas clientes podem solicitar serviços.")

    perfil_cliente = db.query(Cliente).filter(Cliente.usuario_id == usuario_atual.id).first()
    if not perfil_cliente:
        raise HTTPException(status_code=400, detail="Complete seu perfil de cliente antes de solicitar um serviço.")

    profissional = db.query(Profissional).filter(Profissional.id == dados.profissional_id).first()
    if not profissional:
        raise HTTPException(status_code=404, detail="Profissional não encontrado.")
    if not profissional.disponivel:
        raise HTTPException(status_code=400, detail="Este profissional está indisponível no momento.")

    servico = Servico(
        cliente_id=perfil_cliente.id,
        profissional_id=dados.profissional_id,
        titulo=dados.titulo,
        descricao=dados.descricao,
        categoria=dados.categoria,
        endereco_servico=dados.endereco_servico,
        cidade=dados.cidade or perfil_cliente.cidade,
        estado=dados.estado or perfil_cliente.estado,
        data_agendada=dados.data_agendada,
        valor_combinado=dados.valor_combinado,
        status=StatusServico.pendente,
    )
    db.add(servico)
    db.commit()
    db.refresh(servico)
    return _enriquecer(servico, db)


def listar_servicos_do_usuario(
    db: Session,
    usuario_atual,
    status: Optional[StatusServico] = None,
    pagina: int = 1,
    tamanho: int = 10,
) -> dict:
    if usuario_atual.tipo == TipoUsuario.cliente:
        perfil = db.query(Cliente).filter(Cliente.usuario_id == usuario_atual.id).first()
        if not perfil:
            return {"total": 0, "pagina": pagina, "tamanho": tamanho, "servicos": []}
        query = db.query(Servico).filter(Servico.cliente_id == perfil.id)
    else:
        perfil = db.query(Profissional).filter(Profissional.usuario_id == usuario_atual.id).first()
        if not perfil:
            return {"total": 0, "pagina": pagina, "tamanho": tamanho, "servicos": []}
        query = db.query(Servico).filter(Servico.profissional_id == perfil.id)

    if status:
        query = query.filter(Servico.status == status)

    total = query.count()
    servicos = (
        query.order_by(Servico.criado_em.desc())
        .offset((pagina - 1) * tamanho)
        .limit(tamanho)
        .all()
    )
    return {
        "total": total,
        "pagina": pagina,
        "tamanho": tamanho,
        "paginas": (total + tamanho - 1) // tamanho,
        "servicos": [_enriquecer(s, db) for s in servicos],
    }


def buscar_servico_por_id(db: Session, servico_id: int, usuario_atual) -> Servico:
    servico = db.query(Servico).filter(Servico.id == servico_id).first()
    if not servico:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")
    _verificar_acesso(servico, usuario_atual, db)
    return _enriquecer(servico, db)


def mudar_status(
    db: Session, servico_id: int, dados: ServicoMudarStatus, usuario_atual
) -> Servico:
    servico = db.query(Servico).filter(Servico.id == servico_id).first()
    if not servico:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")

    _verificar_acesso(servico, usuario_atual, db)

    if dados.status not in TRANSICOES_VALIDAS[servico.status]:
        raise HTTPException(
            status_code=400,
            detail=f"Não é possível mudar de '{servico.status}' para '{dados.status}'.",
        )

    servico.status = dados.status

    if dados.status == StatusServico.em_andamento:
        servico.data_inicio = datetime.utcnow()
    elif dados.status == StatusServico.concluido:
        servico.data_conclusao = datetime.utcnow()
        if dados.valor_final:
            servico.valor_final = dados.valor_final
        # Incrementa contador de serviços do profissional
        profissional = db.query(Profissional).filter(Profissional.id == servico.profissional_id).first()
        if profissional:
            profissional.total_servicos += 1
    elif dados.status in [StatusServico.cancelado, StatusServico.recusado]:
        if dados.motivo_cancelamento:
            servico.motivo_cancelamento = dados.motivo_cancelamento

    db.commit()
    db.refresh(servico)
    return _enriquecer(servico, db)


def _verificar_acesso(servico: Servico, usuario_atual, db: Session):
    """Garante que apenas as partes envolvidas acessem o serviço."""
    if usuario_atual.tipo == TipoUsuario.cliente:
        perfil = db.query(Cliente).filter(Cliente.usuario_id == usuario_atual.id).first()
        if not perfil or servico.cliente_id != perfil.id:
            raise HTTPException(status_code=403, detail="Acesso negado.")
    else:
        perfil = db.query(Profissional).filter(Profissional.usuario_id == usuario_atual.id).first()
        if not perfil or servico.profissional_id != perfil.id:
            raise HTTPException(status_code=403, detail="Acesso negado.")


def _enriquecer(servico: Servico, db: Session) -> Servico:
    if servico.cliente and servico.cliente.usuario:
        servico.cliente_nome = (
            f"{servico.cliente.usuario.nome} {servico.cliente.usuario.sobrenome}"
        )
    if servico.profissional and servico.profissional.usuario:
        servico.profissional_nome = (
            f"{servico.profissional.usuario.nome} {servico.profissional.usuario.sobrenome}"
        )
        servico.profissional_categoria = servico.profissional.categoria
    return servico