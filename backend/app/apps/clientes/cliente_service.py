from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.apps.clientes.cliente_model import Cliente
from app.apps.clientes.cliente_schema import ClienteCriar, ClienteAtualizar
from app.apps.usuarios.usuario_model import Usuario, TipoUsuario


def criar_perfil_cliente(db: Session, dados: ClienteCriar, usuario_id: int) -> Cliente:
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario or usuario.tipo != TipoUsuario.cliente:
        raise HTTPException(status_code=403, detail="Apenas clientes podem criar este perfil.")

    if db.query(Cliente).filter(Cliente.usuario_id == usuario_id).first():
        raise HTTPException(status_code=400, detail="Perfil de cliente já cadastrado.")

    perfil = Cliente(usuario_id=usuario_id, **dados.model_dump())
    db.add(perfil)
    db.commit()
    db.refresh(perfil)
    return _enriquecer(perfil, db)


def buscar_cliente_por_usuario(db: Session, usuario_id: int) -> Cliente:
    perfil = (
        db.query(Cliente)
        .options(joinedload(Cliente.usuario))
        .filter(Cliente.usuario_id == usuario_id)
        .first()
    )
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil de cliente não encontrado.")
    return _enriquecer(perfil, db)


def buscar_cliente_por_id(db: Session, cliente_id: int) -> Cliente:
    perfil = (
        db.query(Cliente)
        .options(joinedload(Cliente.usuario))
        .filter(Cliente.id == cliente_id)
        .first()
    )
    if not perfil:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return _enriquecer(perfil, db)


def atualizar_perfil_cliente(db: Session, usuario_id: int, dados: ClienteAtualizar) -> Cliente:
    perfil = db.query(Cliente).filter(Cliente.usuario_id == usuario_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil de cliente não encontrado.")
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(perfil, campo, valor)
    db.commit()
    db.refresh(perfil)
    return _enriquecer(perfil, db)


def _enriquecer(cliente: Cliente, db: Session) -> Cliente:
    """Injeta dados do usuário no objeto cliente para a resposta."""
    if cliente.usuario:
        cliente.nome = cliente.usuario.nome
        cliente.sobrenome = cliente.usuario.sobrenome
        cliente.email = cliente.usuario.email
        cliente.telefone = cliente.usuario.telefone
    return cliente