# Bit-fly.co Monorepo

Este é o monorepo do projeto bit-fly.co, um encurtador de URLs moderno e eficiente.

## Estrutura do Projeto

```
bit-fly.co/
├── apps/
│   ├── backend/          # API do encurtador de URLs
│   └── email-service/    # Serviço de email (futuro)
├── docker-compose.yml    # Configuração Docker para produção
├── Dockerfile           # Build da aplicação
└── package.json         # Configuração do workspace
```

## Tecnologias Utilizadas

- **Gerenciador de Pacotes**: pnpm
- **Backend**: Node.js, Fastify, TypeScript
- **Banco de Dados**: SQLite com Prisma ORM
- **Containerização**: Docker & Docker Compose

## Como Executar

### Pré-requisitos

- Node.js 20.x
- pnpm >= 8.0.0

### Instalação

```bash
# Instalar dependências
pnpm install

# Gerar cliente Prisma
cd apps/backend && npx prisma generate
```

### Desenvolvimento

```bash
# Executar o backend em modo desenvolvimento
pnpm backend:dev

# Ou executar todos os serviços
pnpm dev
```

### Build e Produção

```bash
# Build do backend
pnpm backend:build

# Executar em produção
pnpm backend:start

# Ou usar Docker
docker-compose up -d
```

## Scripts Disponíveis

### Scripts Globais (raiz)
- `pnpm dev` - Executa todos os serviços em desenvolvimento
- `pnpm build` - Build de todos os apps
- `pnpm start` - Inicia todos os apps em produção
- `pnpm test` - Executa testes de todos os apps

### Scripts Específicos
- `pnpm backend:dev` - Desenvolvimento do backend
- `pnpm backend:build` - Build do backend
- `pnpm backend:start` - Produção do backend

## Configuração

### Backend
1. Copie o arquivo `.env.example` para `.env` no diretório `apps/backend/`
2. Configure as variáveis de ambiente necessárias:
   - `DATABASE_URL`: URL do banco de dados SQLite
   - `JWT_SECRET`: Chave secreta para JWT
   - `GEMINI_API_KEY`: Chave da API do Google Gemini (opcional)

## Estrutura do Monorepo

Este projeto utiliza pnpm workspaces para gerenciar múltiplas aplicações em um único repositório:

- **apps/backend**: API principal do encurtador de URLs
- **apps/email-service**: Serviço de email (placeholder para futuras funcionalidades)

## Contribuição

1. Clone o repositório
2. Instale as dependências com `pnpm install`
3. Faça suas alterações
4. Execute os testes com `pnpm test`
5. Faça commit e push das suas alterações

## Migração Concluída ✅

A migração de API simples para monorepo foi concluída com sucesso! O projeto agora está estruturado para suportar múltiplos serviços e facilitar o desenvolvimento e deploy.