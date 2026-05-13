from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.apps.usuarios.usuario_model import Usuario
from app.apps.usuarios.usuario_schema import UsuarioCriar, UsuarioAtualizar
from app.core.security import hash_senha, verificar_senha, criar_token


def criar_usuario(db: Session, dados: UsuarioCriar) -> Usuario:
    if db.query(Usuario).filter(Usuario.email == dados.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-mail já cadastrado.",
        )
    usuario = Usuario(
        nome=dados.nome,
        sobrenome=dados.sobrenome,
        email=dados.email,
        telefone=dados.telefone,
        senha_hash=hash_senha(dados.senha),
        tipo=dados.tipo,
        cidade=dados.cidade,
        estado=dados.estado,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def autenticar_usuario(db: Session, email: str, senha: str) -> dict:
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario or not verificar_senha(senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )
    if not usuario.ativo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conta desativada.",
        )
    token = criar_token({"sub": str(usuario.id), "tipo": usuario.tipo})
    return {"access_token": token, "token_type": "bearer", "usuario": usuario}


def buscar_usuario_por_id(db: Session, usuario_id: int) -> Usuario:
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return usuario


def atualizar_usuario(db: Session, usuario_id: int, dados: UsuarioAtualizar) -> Usuario:
    usuario = buscar_usuario_por_id(db, usuario_id)
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(usuario, campo, valor)
    db.commit()
    db.refresh(usuario)
    return usuario


def desativar_usuario(db: Session, usuario_id: int) -> dict:
    usuario = buscar_usuario_por_id(db, usuario_id)
    usuario.ativo = False
    db.commit()
    return {"mensagem": "Conta desativada com sucesso."}
