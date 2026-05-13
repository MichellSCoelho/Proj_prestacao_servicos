from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from fastapi import HTTPException
from app.apps.profissionais.profissional_model import Profissional
from app.apps.profissionais.profissional_schema import ProfissionalCriar, ProfissionalAtualizar
from app.apps.usuarios.usuario_model import Usuario, TipoUsuario


def criar_perfil_profissional(db: Session, dados: ProfissionalCriar, usuario_id: int) -> Profissional:
    # Somente usuários do tipo profissional podem criar perfil
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario or usuario.tipo != TipoUsuario.profissional:
        raise HTTPException(status_code=403, detail="Apenas profissionais podem criar este perfil.")

    if db.query(Profissional).filter(Profissional.usuario_id == usuario_id).first():
        raise HTTPException(status_code=400, detail="Perfil profissional já cadastrado.")

    perfil = Profissional(usuario_id=usuario_id, **dados.model_dump())
    db.add(perfil)
    db.commit()
    db.refresh(perfil)
    return _enriquecer(perfil, db)


def buscar_profissionais(
    db: Session,
    categoria: Optional[str] = None,
    cidade: Optional[str] = None,
    estado: Optional[str] = None,
    termo: Optional[str] = None,
    apenas_verificados: bool = False,
    disponivel: Optional[bool] = None,
    ordem: str = "avaliacao",   # avaliacao | preco | recente
    pagina: int = 1,
    tamanho: int = 12,
) -> dict:
    query = db.query(Profissional).options(joinedload(Profissional.usuario))

    if categoria:
        query = query.filter(Profissional.categoria.ilike(f"%{categoria}%"))
    if cidade:
        query = query.filter(Profissional.cidade.ilike(f"%{cidade}%"))
    if estado:
        query = query.filter(Profissional.estado == estado.upper())
    if termo:
        query = query.filter(
            or_(
                Profissional.descricao.ilike(f"%{termo}%"),
                Profissional.especialidades.ilike(f"%{termo}%"),
                Profissional.categoria.ilike(f"%{termo}%"),
            )
        )
    if apenas_verificados:
        query = query.filter(Profissional.verificado == True)
    if disponivel is not None:
        query = query.filter(Profissional.disponivel == disponivel)

    # Ordenação
    if ordem == "preco":
        query = query.order_by(Profissional.preco_hora.asc())
    elif ordem == "recente":
        query = query.order_by(Profissional.criado_em.desc())
    else:
        query = query.order_by(Profissional.media_avaliacao.desc())

    total = query.count()
    profissionais = query.offset((pagina - 1) * tamanho).limit(tamanho).all()

    return {
        "total": total,
        "pagina": pagina,
        "tamanho": tamanho,
        "paginas": (total + tamanho - 1) // tamanho,
        "profissionais": [_enriquecer(p, db) for p in profissionais],
    }


def buscar_profissional_por_id(db: Session, profissional_id: int) -> Profissional:
    profissional = (
        db.query(Profissional)
        .options(joinedload(Profissional.usuario))
        .filter(Profissional.id == profissional_id)
        .first()
    )
    if not profissional:
        raise HTTPException(status_code=404, detail="Profissional não encontrado.")
    return _enriquecer(profissional, db)


def atualizar_perfil(db: Session, usuario_id: int, dados: ProfissionalAtualizar) -> Profissional:
    perfil = db.query(Profissional).filter(Profissional.usuario_id == usuario_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil profissional não encontrado.")
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(perfil, campo, valor)
    db.commit()
    db.refresh(perfil)
    return _enriquecer(perfil, db)


def _enriquecer(profissional: Profissional, db: Session) -> Profissional:
    """Injeta nome/telefone do usuário no objeto profissional para a resposta."""
    if profissional.usuario:
        profissional.nome = profissional.usuario.nome
        profissional.sobrenome = profissional.usuario.sobrenome
        profissional.telefone = profissional.usuario.telefone
    return profissional
