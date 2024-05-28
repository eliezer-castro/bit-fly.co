## Readme.md para o Bit-Fly

**Bit-Fly:** Um encurtador de URL com foco em testes de API!

O Bit-Fly é um projeto que oferece uma API RESTful para encurtar URLs. Ele foi criado com o objetivo de auxiliar no aprendizado e na prática de testes de API. A API fornece diversos endpoints para realizar operações com URLs, como encurtar, recuperar detalhes, atualizar, excluir e obter sugestões de URLs curtas.

### Funcionalidades

**URLs:**

* **Encurtar URLs:** Gere URLs curtas e memoráveis para seus links longos.
* **Obter detalhes de URLs:** Acesse informações como o URL longo original, o número de cliques e a data de criação da URL curta.
* **Atualizar URLs:** Modifique o título e a URL curta de uma URL existente.
* **Excluir URLs:** Remova URLs curtas que não sejam mais necessárias.
* **Obter sugestões de URLs curtas:** Receba sugestões de URLs curtas com base no URL longo fornecido.
* **Analisar URLs:** Obtenha estatísticas de cliques para cada URL curta.
* **Autenticação:** Proteja seus endpoints com autenticação Bearer.

**Autenticação:**

* **Registro:** Crie uma conta no Bit-Fly com nome, email e senha.
* **Login:** Acesse sua conta usando seu email e senha.
* **Token JWT:** Após o login, receba um token JWT para autenticação em outras requisições.
* **Renovação de Token:** Renove seu token JWT quando necessário.

**Gerenciamento de Perfil:**

* **Atualização:** 
    * Altere seu nome e email.
    * Atualize sua senha.
* **Visualização:** 
    * Acesse seus dados de perfil, incluindo nome, email e data de criação da conta.
* **Exclusão:** 
    * Exclua sua conta permanentemente (com confirmação).

**Casos de uso:**

* **Testes de API:** Utilize o Bit-Fly para testar endpoints de encurtamento de URL em diferentes frameworks de teste.
* **Aplicações Web:** Integre o Bit-Fly em seu aplicativo web para oferecer um serviço de encurtamento de URL aos seus usuários.
* **Ferramentas de produtividade:** Crie ferramentas que utilizem o Bit-Fly para encurtar URLs automaticamente.

## Exemplos de Requisições

Este documento apresenta exemplos de requisições para a API do Bit-Fly. 

**Observação:** Estes endpoints requerem autenticação Bearer. Obtenha um token JWT antes de realizar as chamadas.

### URLs

**1. Encurtar uma URL:**

* **Método:** POST
* **URL:** `/v1/urls`
* **Body:**

```json
{
  "longUrl": "https://www.example.com/long-url"
}
```

* **Resposta:**

```json
{
  "shortUrl": "https://bit.fly/abc123"
}
```

**2. Obter lista de URLs encurtadas:**

* **Método:** GET
* **URL:** `/v1/urls`
* **Parâmetros (opcionais):**
    * `limit`: Número máximo de resultados por página.
    * `orderBy`: Campo para ordenar os resultados (por exemplo, "clicks", "created_at", "updated_at").
    * `orderDir`: Direção da ordenação (por exemplo, "asc" ou "desc").
    * `dateFrom`: Data inicial para filtrar resultados (formato: "YYYY-MM-DD").
    * `dateTo`: Data final para filtrar resultados (formato: "YYYY-MM-DD").
* **Resposta:**

```json
[
  {
    "id": "12345",
    "title": "My Long URL",
    "long_url": "https://www.example.com/long-url",
    "short_url": "https://bit.fly/abc123",
    "clicks": 100,
    "clickDates": [
      "2024-05-27": 50
    ],
    "created_at": "2024-05-27T10:00:00.000Z",
    "updated_at": "2024-05-27T10:00:00.000Z"
  },
  {
    ... (outras URLs)
  }
]
```

**3. Obter detalhes de uma URL curta:**

* **Método:** GET
* **URL:** `/v1/urls/{id}`
* **Caminho:** Substitua `{id}` pelo ID da URL curta.
* **Resposta:**

```json
{
  "id": "12345",
  "title": "My Long URL",
  "long_url": "https://www.example.com/long-url",
  "short_url": "https://bit.fly/abc123",
  "clicks": 100,
  "clickDates": [
      "2024-05-27": 50
    ],
  "created_at": "2024-05-27T10:00:00.000Z",
  "updated_at": "2024-05-27T10:00:00.000Z"
}
```

**4. Atualizar uma URL curta:**

* **Método:** PUT
* **URL:** `/v1/urls/{id}`
* **Caminho:** Substitua `{id}` pelo ID da URL curta.
* **Body:**

```json
{
  "title": "New URL Title",
  "short_url": "new-short-url"
}
```

* **Observação:** Você só pode alterar o título e a própria URL curta (se disponível).

**5. Excluir uma URL curta:**

* **Método:** DELETE
* **URL:** `/v1/urls/{id}`
* **Caminho:** Substitua `{id}` pelo ID da URL curta.
* **Resposta:**

```json
{
  "message": "URL excluída com sucesso."
}
```

**6. Redirecionar para URL original:**

* **Método:** GET
* **URL:** `/{shortCode}`
* **Caminho:** Substitua `{shortCode}` pelo código curto da URL.
* **Resposta (Código de Status):**




### Autenticação & Usuário

**1. Registrar um novo usuário:**

* **Método:** POST
* **URL:** `/v1/register`
* **Body:**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "mypassword"
}
```

* **Resposta:**

```json
{
  "message": "Usuário registrado com sucesso."
}
```

**2. Fazer login:**

* **Método:** POST
* **URL:** `/v1/login`
* **Body:**

```json
{
  "email": "johndoe@example.com",
  "password": "mypassword"
}
```

* **Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWQiOiIxMjM0NSIsIm5iZiI6IjE2NTc2ODk1OTUiLCJlbWFpbCI6Impvbmhkb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2NTc2ODk2MTUsImV4cCI6MTY1NzY5MzYxNSwic3ViOiJqdW5pb3MifQ.234567890abcdefghijklmnopqrstuvwxyz"
}
```

### Usuário

**3. Atualizar perfil do usuário:**

* **Método:** PUT
* **URL:** `/v1/user/profile`
* **Body:**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "currentPassword": "mypassword",
  "password": "newpassword"
}
```

* **Resposta:**

```json
{
  "message": "Perfil do usuário atualizado com sucesso.",
  "data": {
    "id": "12345",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "newpassword",
    "created_at": "2024-05-28T17:56:00.000Z"
  }
}
```

**4. Obter perfil do usuário:**

* **Método:** GET
* **URL:** `/v1/user/profile`
* **Resposta:**

```json
{
  "id": "12345",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "newpassword",
  "created_at": "2024-05-28T17:56:00.000Z"
}
```

**5. Excluir usuário:**

* **Método:** DELETE
* **URL:** `/v1/user`
* **Body:**

```json
{
  "password": "newpassword"
}
```

* **Resposta:**

```json
{
  "message": "Usuário excluído com sucesso."
}
```

**6. Renovar token:**

* **Método:** PATCH
* **URL:** `/v1/token/refresh`
* **Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWQiOiIxMjM0NSIsIm5iZiI6IjE2NTc2ODk2MTUsImlbWFpbCI6Impvbmhkb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2NTc2ODk2MTUsImV4cCI6MTY1NzY5MzYxNSwic3ViOiJqdW5pb3MifQ.234567890abcdefghijklmnopqrstuvwxyz"
}
```

**Observações:**

* A senha precisa ter pelo menos 6 caracteres.
* O email precisa ser válido e único.
* O nome do usuário pode ter no máximo 255 caracteres

**Contribuições:**
O Bit-Fly é um projeto Open Source e você é bem-vindo a contribuir! Você pode enviar issues, pull requests ou participar da comunidade.

**Links Úteis:**

* Repositório GitHub: [bit-fly.co](https://github.com/eliezer-castro/bit-fly.co)
* API: [api.bit-fly.co](http://api.bit-fly.co:3333/api/v1/6wbManF)
* Documentação Swagger: [Swagger](http://api.bit-fly.co:3333/docs/static/index.html)

