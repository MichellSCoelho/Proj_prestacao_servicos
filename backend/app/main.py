from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine

# Importar todos os models para o Alembic enxergar
from app.apps.usuarios.usuario_model import Usuario              # noqa
from app.apps.profissionais.profissional_model import Profissional  # noqa
from app.apps.clientes.cliente_model import Cliente              # noqa
from app.apps.servicos.servico_model import Servico              # noqa
from app.apps.avaliacoes.avaliacao_model import Avaliacao        # noqa

# Importar routers
from app.apps.usuarios.usuario_router import router as usuario_router
from app.apps.profissionais.profissional_router import router as profissional_router
from app.apps.clientes.cliente_router import router as cliente_router
from app.apps.servicos.servico_router import router as servico_router
from app.apps.avaliacoes.avaliacao_router import router as avaliacao_router

# Cria as tabelas (em produção, use Alembic migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API do MeuPrestador — marketplace de serviços e freelancers",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — permite o frontend React acessar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
PREFIX = "/api"
app.include_router(usuario_router, prefix=PREFIX)
app.include_router(profissional_router, prefix=PREFIX)
app.include_router(cliente_router, prefix=PREFIX)
app.include_router(servico_router, prefix=PREFIX)
app.include_router(avaliacao_router, prefix=PREFIX)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "versao": settings.APP_VERSION}