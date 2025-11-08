# PedeAI Backend 🍕<p align="center">

  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

Backend completo para aplicativo de delivery de comida, construído com NestJS, TypeORM e PostgreSQL.</p>



## 📋 Índice[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

- [Recursos](#recursos)

- [Tecnologias](#tecnologias)  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

- [Pré-requisitos](#pré-requisitos)    <p align="center">

- [Instalação](#instalação)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

- [Configuração](#configuração)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

- [Executando o Projeto](#executando-o-projeto)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

- [Banco de Dados](#banco-de-dados)<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

- [Endpoints da API](#endpoints-da-api)<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

- [Regras de Negócio](#regras-de-negócio)<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

- [Testando com Postman](#testando-com-postman)<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

- [Integração com Frontend](#integração-com-frontend)  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

- [Estrutura do Projeto](#estrutura-do-projeto)    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

## 🚀 Recursos</p>

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

- ✅ Autenticação JWT com bcrypt  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

- ✅ 5 CRUDs completos (Users, Restaurants, Products, Orders, Addresses)

- ✅ 19+ regras de negócio implementadas## Description

- ✅ Validação de dados com class-validator

- ✅ Migrações TypeORM[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

- ✅ Seed de dados de exemplo

- ✅ CORS habilitado para React Native## Project setup

- ✅ Coleção Postman incluída

```bash

## 🛠️ Tecnologias$ npm install

```

- **NestJS** - Framework Node.js progressivo

- **TypeORM** - ORM para TypeScript e JavaScript## Compile and run the project

- **PostgreSQL** - Banco de dados relacional

- **JWT** - Autenticação via JSON Web Tokens```bash

- **bcrypt** - Hash de senhas# development

- **class-validator** - Validação de DTOs$ npm run start

- **class-transformer** - Transformação de objetos

# watch mode

## 📦 Pré-requisitos$ npm run start:dev



- Node.js v18+ # production mode

- PostgreSQL v14+$ npm run start:prod

- npm ou yarn```



## 💿 Instalação## Run tests



```powershell```bash

# Clone o repositório (se aplicável)# unit tests

cd C:\Users\isacp\Desktop\pedeai-backend$ npm run test



# Instale as dependências# e2e tests

npm install$ npm run test:e2e

```

# test coverage

## ⚙️ Configuração$ npm run test:cov

```

1. **Configure as variáveis de ambiente**

## Deployment

Edite o arquivo `.env` com suas credenciais:

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

```env

# DatabaseIf you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

DB_HOST=localhost

DB_PORT=5432```bash

DB_USERNAME=pedeai_user$ npm install -g @nestjs/mau

DB_PASSWORD=1234$ mau deploy

DB_DATABASE=pedeai```



# JWTWith Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

JWT_SECRET=supersecretjwt

JWT_EXPIRES_IN=7d## Resources



# ApplicationCheck out a few resources that may come in handy when working with NestJS:

PORT=3000

NODE_ENV=development- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

```- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

2. **Crie o banco de dados PostgreSQL**- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

```powershell- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

# Via psql (PowerShell)- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -U postgres -p 5432 -d postgres- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).



# Dentro do psql, execute:## Support

CREATE DATABASE pedeai;

CREATE ROLE pedeai_user WITH LOGIN PASSWORD '1234';Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

ALTER DATABASE pedeai OWNER TO pedeai_user;

\c pedeai## Stay in touch

GRANT ALL ON SCHEMA public TO pedeai_user;

\q- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

```- Website - [https://nestjs.com](https://nestjs.com/)

- Twitter - [@nestframework](https://twitter.com/nestframework)

## 🏃 Executando o Projeto

## License

### Compilar o projeto

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

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
- 1 usuário de teste: `teste@pedeai.com` / senha: `123456`
- 5 restaurantes com categorias variadas
- 15 produtos distribuídos entre os restaurantes
- 1 endereço de exemplo

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

- **users** - Usuários do aplicativo
- **restaurants** - Restaurantes cadastrados
- **products** - Produtos/itens de menu
- **addresses** - Endereços de entrega dos usuários
- **orders** - Pedidos realizados
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

### Restaurantes (público)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/restaurants` | Listar restaurantes ativos |
| GET | `/restaurants/:id` | Obter restaurante por ID |
| POST | `/restaurants` | Criar restaurante |
| PATCH | `/restaurants/:id` | Atualizar restaurante |
| DELETE | `/restaurants/:id` | Remover restaurante |

### Produtos (público)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/products` | Listar todos os produtos |
| GET | `/products?restaurant_id=1` | Listar produtos de um restaurante |
| GET | `/products/:id` | Obter produto por ID |
| POST | `/products` | Criar produto |
| PATCH | `/products/:id` | Atualizar produto |
| DELETE | `/products/:id` | Remover produto |

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

### Autenticação
1. **Email único** - Não permitir cadastro duplicado
2. **Hash de senha** - Senha deve ter hash bcrypt (min 10 rounds)
3. **Validar senha** - Comparar hash ao fazer login

### Usuários
4. **Alterar email** - Validar unicidade ao atualizar
5. **Alterar senha** - Aplicar hash ao atualizar

### Restaurantes
6. **Nome único** - Não permitir nomes duplicados
7. **Listar ativos** - Listar apenas restaurantes com `is_active = true`
8. **Validar nome** - Ao atualizar, verificar unicidade

### Produtos
9. **Restaurante existente** - Produto deve pertencer a restaurante válido
10. **Produtos disponíveis** - Listar apenas produtos com `is_available = true`
11. **Validar restaurante** - Ao atualizar, verificar se restaurante existe

### Endereços
12. **Endereço padrão único** - Ao marcar como padrão, desmarcar outros do usuário
13. **Atualizar padrão** - Mesma regra ao atualizar

### Pedidos
14. **Validar usuário** - Usuário deve existir ao criar pedido
15. **Restaurante ativo** - Restaurante deve existir e estar ativo
16. **Produtos do restaurante** - Todos produtos devem pertencer ao mesmo restaurante e estar disponíveis
17. **Validar total** - Recalcular e validar total do pedido
18. **Transições de status** - Validar fluxo: pending → confirmed → preparing → delivering → delivered (cancelled permitido até delivering)
19. **Não deletar finalizados** - Não permitir deletar pedidos confirmados ou finalizados

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
- ✅ Casos de erro (credenciais inválidas, email duplicado, total inválido, transições de status inválidas)

## 🔗 Integração com Frontend

### Configurar URL base no React Native

No arquivo `src/api/api.ts` do frontend:

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
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { access_token } = await response.json();

// Usar token em requests protegidos
const response = await fetch(`${API_BASE_URL}/orders/my`, {
  headers: { 
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
});
```

### Tratamento de Erros

O backend retorna erros estruturados:

```json
{
  "statusCode": 400,
  "message": "Credenciais inválidas",
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

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Confirme que o PostgreSQL está rodando
3. Valide as variáveis de ambiente no `.env`
4. Teste os endpoints com a coleção do Postman

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

---

Desenvolvido com ❤️ usando NestJS
