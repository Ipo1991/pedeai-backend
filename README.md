# PedeAI Backend 🍕

Backend completo para aplicativo de delivery de comida, construído com NestJS, TypeORM e PostgreSQL.

## 📋 Índice

- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Banco de Dados](#banco-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Regras de Negócio](#regras-de-negócio)
- [Testando com Postman](#testando-com-postman)
- [Integração com Frontend](#integração-com-frontend)
- [Estrutura do Projeto](#estrutura-do-projeto)

## 🚀 Recursos

- ✅ Autenticação JWT com bcrypt
- ✅ 5 CRUDs completos (Users, Restaurants, Products, Orders, Addresses)
- ✅ 15 regras de negócio implementadas
- ✅ Validação de dados com class-validator
- ✅ Migrações TypeORM
- ✅ Seed de dados de exemplo
- ✅ CORS habilitado para React Native
- ✅ Coleção Postman incluída

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeORM** - ORM para TypeScript e JavaScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via JSON Web Tokens
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos

## 📦 Pré-requisitos

- Node.js v18+
- PostgreSQL v14+
- npm ou yarn

## 💿 Instalação

```powershell
# Clone o repositório (se aplicável)
cd C:\Users\isacp\Desktop\pedeai-backend

# Instale as dependências
npm install
```

## ⚙️ Configuração

1. **Configure as variáveis de ambiente**

Edite o arquivo `.env` com suas credenciais:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pedeai_user
DB_PASSWORD=1234
DB_DATABASE=pedeai

# JWT
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

2. **Crie o banco de dados PostgreSQL**

```powershell
# Via psql (PowerShell)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -U postgres -p 5432 -d postgres

# Dentro do psql, execute:
CREATE DATABASE pedeai;
CREATE ROLE pedeai_user WITH LOGIN PASSWORD '1234';
ALTER DATABASE pedeai OWNER TO pedeai_user;
\c pedeai
GRANT ALL ON SCHEMA public TO pedeai_user;
\q
```

## 🏃 Executando o Projeto

### Compilar o projeto

```powershell
npm run build
```

### Executar migrações

```powershell
# Gerar migração (se houver mudanças nas entidades)
npm run migration:generate src/migrations/NomeDaMigracao

# Executar migrações
npm run migration:run

# Reverter última migração
npm run migration:revert
```

### Popular banco com dados de exemplo

```powershell
npm run seed
```

Isso criará:
- 2 usuários: `teste@pedeai.com` / `admin@pedeai.com` (senha: `123456`)
- 5 restaurantes com categorias variadas
- 15 produtos distribuídos entre os restaurantes
- 2 endereços de exemplo em Florianópolis/SC

### Iniciar o servidor

```powershell
# Modo desenvolvimento (watch mode)
npm run start:dev

# Modo produção
npm run start:prod
```

O servidor estará rodando em `http://localhost:3000`

## 🗄️ Banco de Dados

### Estrutura de Tabelas

- **users** - Usuários do aplicativo (campos: email, password, name, phone, birth_date, is_admin)
- **restaurants** - Restaurantes cadastrados (campos: name, category, image, is_active)
- **products** - Produtos/itens de menu (campos: name, description, price, image, is_available, restaurant_id)
- **addresses** - Endereços de entrega (campos: street, number, city, state, zip, is_default, user_id)
- **orders** - Pedidos realizados (campos: user_id, restaurant_id, restaurant_name, items, total, status, address, payment_type)
- **migrations** - Controle de migrações

### Diagrama de Relacionamentos

```
users 1--* addresses
users 1--* orders
restaurants 1--* products
```

## 🌐 Endpoints da API

### Autenticação (sem autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar novo usuário |
| POST | `/auth/login` | Fazer login e obter token JWT |

### Usuários (requer JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users/profile` | Obter perfil do usuário logado |
| GET | `/users/:id` | Obter usuário por ID |
| PATCH | `/users/:id` | Atualizar dados do usuário |
| DELETE | `/users/:id` | Remover usuário |
| POST | `/users/change-password` | Alterar senha do usuário logado |

### Restaurantes (público)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/restaurants` | Listar restaurantes ativos |
| GET | `/restaurants/:id` | Obter restaurante por ID |
| POST | `/restaurants` | Criar restaurante (requer admin) |
| PATCH | `/restaurants/:id` | Atualizar restaurante (requer admin) |
| DELETE | `/restaurants/:id` | Remover restaurante (requer admin) |

### Produtos (público)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/products` | Listar todos os produtos |
| GET | `/products?restaurant_id=1` | Listar produtos de um restaurante |
| GET | `/products/:id` | Obter produto por ID |
| POST | `/products` | Criar produto (requer admin) |
| PATCH | `/products/:id` | Atualizar produto (requer admin) |
| DELETE | `/products/:id` | Remover produto (requer admin) |

### Endereços (requer JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/addresses/my` | Listar endereços do usuário logado |
| GET | `/addresses/:id` | Obter endereço por ID |
| POST | `/addresses` | Criar endereço |
| PATCH | `/addresses/:id` | Atualizar endereço |
| DELETE | `/addresses/:id` | Remover endereço |

### Pedidos (requer JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/orders/my` | Listar pedidos do usuário logado |
| GET | `/orders/:id` | Obter pedido por ID |
| POST | `/orders` | Criar pedido |
| PATCH | `/orders/:id` | Atualizar status do pedido |
| DELETE | `/orders/:id` | Cancelar pedido (apenas pending) |

## 📜 Regras de Negócio

### Usuários (5 regras)
1. **Email único** - Não permitir cadastro duplicado
2. **Idade mínima** - Usuário deve ter 18 anos ou mais
3. **Telefone com DDD 48** - Validar formato (48)XXXXXXXXX
4. **Hash de senha** - Senha deve ter hash bcrypt (min 10 rounds)
5. **Validar senha** - Comparar hash ao fazer login

### Endereços (2 regras)
6. **Endereço padrão único** - Ao marcar como padrão, desmarcar outros do usuário
7. **CEP de Florianópolis** - Validar que CEP começa com 880 (Florianópolis/SC)

### Métodos de Pagamento (1 regra)
8. **Pagamento padrão único** - Ao marcar como padrão, desmarcar outros do usuário

### Restaurantes (1 regra)
9. **Nome único** - Não permitir nomes duplicados (case-insensitive)

### Pedidos (3 regras)
10. **Valor mínimo** - Pedido deve ter valor mínimo de R$ 50,00
11. **Restaurante diferente** - Não permitir pedido consecutivo do mesmo restaurante
12. **Limite diário** - Máximo de 3 pedidos por dia por usuário

### Produtos (3 regras)
13. **Nome único por restaurante** - Não permitir produtos com mesmo nome no mesmo restaurante
14. **Preço mínimo** - Produto deve ter preço mínimo de R$ 10,00
15. **Limite diário de criação** - Máximo de 3 produtos criados por dia por restaurante

## 🧪 Testando com Postman

1. Importe a coleção `PedeAI.postman_collection.json` no Postman
2. A variável `{{baseUrl}}` já está configurada para `http://localhost:3000`
3. Faça login com o request "Auth > Login" usando:
   ```json
   {
     "email": "teste@pedeai.com",
     "password": "123456"
   }
   ```
4. O token JWT será automaticamente salvo na variável `{{token}}`
5. Todos os requests protegidos usarão esse token automaticamente

### Casos de Teste Incluídos

- ✅ Registro e login de usuários
- ✅ CRUD completo de todas entidades
- ✅ Validações de regras de negócio
- ✅ Casos de erro (credenciais inválidas, email duplicado, validações falhando)

## 🔗 Integração com Frontend

### Configurar URL base no React Native

No arquivo `src/services/ApiService.ts` do frontend:

```typescript
const API_BASE_URL = 'http://localhost:3000'; // Desenvolvimento
// ou
const API_BASE_URL = 'http://SEU_IP:3000'; // Para testar no device
```

### Endpoints principais para o app

1. **Login**: `POST /auth/login`
2. **Registro**: `POST /auth/register`
3. **Restaurantes**: `GET /restaurants`
4. **Produtos do restaurante**: `GET /products?restaurant_id={id}`
5. **Criar pedido**: `POST /orders` (requer autenticação)
6. **Histórico**: `GET /orders/my` (requer autenticação)
7. **Endereços**: `GET /addresses/my` (requer autenticação)

### Autenticação no Frontend

```typescript
// Login
const response = await api.post('/auth/login', { email, password });
const { access_token, isAdmin } = response.data;

// Salvar token
setAuthToken(access_token);

// Usar token em requests protegidos (automático com ApiService)
const response = await api.get('/orders/my');
```

### Tratamento de Erros

O backend retorna erros estruturados:

```json
{
  "statusCode": 400,
  "message": "Você já fez um pedido neste restaurante. Escolha outro!",
  "error": "Bad Request"
}
```

## 📁 Estrutura do Projeto

```
pedeai-backend/
├── src/
│   ├── addresses/          # Módulo de endereços
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── addresses.controller.ts
│   │   ├── addresses.service.ts
│   │   └── addresses.module.ts
│   ├── auth/               # Módulo de autenticação
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── orders/             # Módulo de pedidos
│   ├── products/           # Módulo de produtos
│   ├── restaurants/        # Módulo de restaurantes
│   ├── users/              # Módulo de usuários
│   ├── migrations/         # Migrações do banco
│   ├── seeds/              # Scripts de seed
│   ├── app.module.ts       # Módulo raiz
│   ├── data-source.ts      # Configuração TypeORM
│   └── main.ts             # Bootstrap da aplicação
├── .env                    # Variáveis de ambiente
├── package.json
├── tsconfig.json
├── nest-cli.json
├── PedeAI.postman_collection.json
└── README.md
```
