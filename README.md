# MeuPrestador — Backend (FastAPI)

## Pré-requisitos
- Python 3.11+
- PostgreSQL instalado e rodando

---

## 1. Clonar e entrar na pasta
```bash
cd meuprestador/backend
```

## 2. Criar e ativar o ambiente virtual
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux / Mac
python -m venv .venv
source .venv/bin/activate
```

## 3. Instalar dependências
```bash
pip install -r requirements.txt
```

## 4. Configurar o banco de dados
Crie um banco no PostgreSQL:
```sql
CREATE DATABASE meuprestador;
```

Edite o arquivo `.env` com suas credenciais:
```
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/meuprestador
SECRET_KEY=uma-chave-secreta-forte-aqui
```

## 5. Rodar a API
```bash
uvicorn app.main:app --reload
```

A API estará disponível em: **http://localhost:8000**

---

## Documentação interativa (Swagger)
Acesse: **http://localhost:8000/docs**

---

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/cadastro | Cadastrar cliente ou profissional |
| POST | /api/auth/login | Login — retorna JWT |
| GET | /api/usuarios/me | Meu perfil (autenticado) |
| PUT | /api/usuarios/me | Atualizar meu perfil |
| POST | /api/profissionais | Criar perfil profissional |
| GET | /api/profissionais | Buscar profissionais (com filtros) |
| GET | /api/profissionais/{id} | Perfil detalhado do profissional |
| PUT | /api/profissionais/me | Atualizar meu perfil profissional |
| POST | /api/avaliacoes | Avaliar um profissional |
| GET | /api/avaliacoes/profissional/{id} | Avaliações de um profissional |
| POST | /api/avaliacoes/{id}/resposta | Profissional responde avaliação |

---

## Estrutura de pastas
```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          ← variáveis de ambiente
│   │   ├── database.py        ← conexão SQLAlchemy
│   │   └── security.py        ← JWT + hash de senha
│   ├── apps/
│   │   ├── usuarios/          ← auth + cadastro
│   │   ├── profissionais/     ← perfis e busca
│   │   ├── clientes/          ← (próxima etapa)
│   │   ├── servicos/          ← (próxima etapa)
│   │   └── avaliacoes/        ← sistema de rating
│   └── main.py                ← entrada da API
├── .env
└── requirements.txt
```
