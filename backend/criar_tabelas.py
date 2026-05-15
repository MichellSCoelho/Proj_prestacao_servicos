
from app.core.database import Base, engine
from app.apps.usuarios.usuario_model import Usuario
from app.apps.profissionais.profissional_model import Profissional
from app.apps.clientes.cliente_model import Cliente
from app.apps.servicos.servico_model import Servico
from app.apps.avaliacoes.avaliacao_model import Avaliacao
Base.metadata.create_all(bind=engine)
print('Tabelas criadas com sucesso')

