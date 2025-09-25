# Configuração do Sistema de Email

Este documento explica como configurar e usar o sistema de envio de emails no cadastro de usuários.

## Arquitetura

O sistema funciona da seguinte forma:

1. **Backend** - Quando um usuário se cadastra, publica uma mensagem no RabbitMQ
2. **RabbitMQ** - Faz a comunicação assíncrona entre os serviços
3. **Email Service** - Consome as mensagens e envia emails de boas-vindas

## Configuração

### 1. Iniciar o RabbitMQ

```bash
# Usando Docker Compose (recomendado)
docker-compose up -d rabbitmq

# Ou instalar localmente
# Windows: https://www.rabbitmq.com/install-windows.html
# macOS: brew install rabbitmq
# Linux: sudo apt-get install rabbitmq-server
```

### 2. Configurar Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL="file:./data/database.db"
JWT_SECRET=seu-jwt-secret-aqui
GEMINI_API_KEY=sua-api-key-aqui
RABBITMQ_URL=amqp://localhost:5672
```

#### Email Service (.env)
```env
RABBITMQ_URL=amqp://localhost:5672
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_FROM=noreply@bit-fly.co
```

### 3. Configurar Gmail (Exemplo)

1. Ative a autenticação de 2 fatores na sua conta Google
2. Gere uma senha de aplicativo:
   - Vá para: https://myaccount.google.com/apppasswords
   - Selecione "Mail" e "Other (custom name)"
   - Use a senha gerada no `EMAIL_PASS`

### 4. Iniciar os Serviços

```bash
# Terminal 1: Backend
cd apps/backend
pnpm dev

# Terminal 2: Email Service
cd apps/email-service
pnpm dev
```

## Testando o Sistema

### 1. Cadastrar um Usuário

```bash
curl -X POST http://localhost:3000/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "123456"
  }'
```

### 2. Verificar Logs

- **Backend**: Deve mostrar "Mensagem publicada na fila user_registered"
- **Email Service**: Deve mostrar "Email de boas-vindas enviado para: joao@exemplo.com"

### 3. Interface do RabbitMQ

Acesse http://localhost:15672 (admin/admin123) para monitorar as filas.

## Estrutura dos Arquivos

```
apps/
├── backend/
│   ├── src/
│   │   ├── services/messaging-service.ts    # Cliente RabbitMQ do backend
│   │   ├── use-cases/register-use-case.ts   # Publica evento de cadastro
│   │   └── server.ts                        # Inicializa RabbitMQ
│   └── .env.example
├── email-service/
│   ├── src/
│   │   ├── server.tsx                       # Serviço principal
│   │   ├── rabbit-client.ts                 # Cliente RabbitMQ
│   │   └── email-templates.ts               # Templates de email
│   └── .env.example
```

## Troubleshooting

### RabbitMQ não conecta
- Verifique se o RabbitMQ está rodando: `docker ps` ou `sudo systemctl status rabbitmq-server`
- Confirme a URL: `amqp://localhost:5672`

### Email não envia
- Verifique as credenciais do Gmail
- Confirme se a autenticação de 2 fatores está ativa
- Use senha de aplicativo, não a senha normal da conta

### Mensagens não chegam
- Verifique os logs do backend e email-service
- Acesse a interface do RabbitMQ para ver se as mensagens estão na fila
- Confirme se ambos os serviços estão usando a mesma URL do RabbitMQ

## Próximos Passos

- [ ] Adicionar retry automático para emails falhados
- [ ] Implementar templates de email mais avançados
- [ ] Adicionar outros tipos de notificação (SMS, push)
- [ ] Configurar monitoramento e alertas