<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# API de Sistema de Puntos

API GraphQL para un sistema de puntos de fidelidad donde los usuarios pueden acumular puntos por compras, consultar su saldo e historial, y redimir recompensas.

## 📋 Índice
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [API GraphQL](#api-graphql)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Desarrollo](#desarrollo)
- [Despliegue](#despliegue)

## 🏗️ Arquitectura

### Diagrama de Arquitectura
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Cliente       │     │   API GraphQL   │     │   Cloud         │
│   (Frontend)    │────▶│   (NestJS)      │────▶│   Functions     │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                        ┌────────┴────────┐
                        │                 │
                ┌───────▼─────┐   ┌───────▼─────┐
                │ PostgreSQL  │   │  MongoDB    │
                │ (Principal) │   │  (Logs)     │
                └─────────────┘   └─────────────┘
                        │                 │
                ┌───────▼─────┐   ┌───────▼─────┐
                │  BigQuery   │   │  Cloud      │
                │ (Analytics) │   │  Storage    │
                └─────────────┘   └─────────────┘
```

### Componentes Principales

1. **API GraphQL (NestJS)**
   - Servidor principal que maneja todas las operaciones
   - Implementa el esquema GraphQL
   - Gestiona la lógica de negocio
   - Coordina las interacciones entre servicios

2. **Bases de Datos**
   - **PostgreSQL**: Almacena datos principales (usuarios, transacciones)
   - **MongoDB**: Almacena logs y eventos del sistema
   - **BigQuery**: Almacena datos analíticos y resúmenes

3. **Cloud Functions**
   - Procesamiento asíncrono de puntos
   - Registro de eventos
   - Integración con servicios externos

## 📋 Requisitos

### Requisitos de Sistema
- Node.js v14 o superior
- PostgreSQL 12 o superior
- MongoDB 4.4 o superior
- Docker (opcional, para desarrollo)

### Cuentas y Servicios
- Cuenta de Google Cloud Platform
- MongoDB Atlas (recomendado)
- PostgreSQL (local o en la nube)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/your-username/points-api.git
cd points-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```


4. **Ejecutar migraciones**
```bash
npm run migration:run
```

## ⚙️ Configuración

### Variables de Entorno (.env)
```env
# Servidor
PORT=3000
NODE_ENV=development

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=points_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/points_logs

# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-cloud-key.json
CLOUD_FUNCTION_URL=https://your-region-your-project.cloudfunctions.net/register-points

# BigQuery
BIGQUERY_DATASET=points_system
BIGQUERY_TABLE=points_transactions
```

## 📚 API GraphQL

### Tipos

#### User
```graphql
type User {
  id: ID!
  name: String!
  totalPoints: Float!
  transactions: [Transaction!]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### Transaction
```graphql
type Transaction {
  id: ID!
  userId: ID!
  user: User!
  type: String!
  points: Int!
  date: DateTime!
  description: String
  reference: String
}
```

#### Reward
```graphql
type Reward {
  id: ID!
  name: String!
  description: String
  pointsCost: Int!
  stock: Int
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### Queries

#### Consultar Puntos de Usuario
```graphql
query GetUserPoints($userId: ID!) {
  getUserPoints(userId: $userId) {
    id
    name
    totalPoints
    updatedAt
  }
}
```

#### Historial de Transacciones
```graphql
query GetUserHistory($userId: ID!) {
  getUserHistory(userId: $userId) {
    id
    points
    type
    description
    date
    reference
  }
}
```

#### Listar Recompensas Disponibles
```graphql
query GetAvailableRewards($userId: ID!) {
  getAvailableRewards(userId: $userId) {
    id
    name
    pointsCost
    stock
    description
  }
}
```

### Mutations

#### Registrar Compra
```graphql
mutation RegisterPurchase($userId: ID!, $amount: Float!) {
  registerPurchase(userId: $userId, amount: $amount) {
    id
    points
    type
    description
    reference
  }
}
```

#### Redimir Puntos
```graphql
mutation RedeemPoints($userId: ID!, $rewardId: ID!) {
  redeemPoints(userId: $userId, rewardId: $rewardId) {
    id
    points
    type
    description
  }
}
```

## 💡 Ejemplos de Uso

### 1. Registrar una Compra
```graphql
mutation {
  registerPurchase(userId: "550e8400-e29b-41d4-a716-446655440000", amount: 100.50) {
    id
    points
    type
    description
    reference
  }
}
```
Respuesta:
```json
{
  "data": {
    "registerPurchase": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "points": 10,
      "type": "earn",
      "description": "Compra registrada por 100.50",
      "reference": "PURCHASE-1234567890-abc123"
    }
  }
}
```

### 2. Consultar Saldo
```graphql
query {
  getUserPoints(userId: "550e8400-e29b-41d4-a716-446655440000") {
    id
    name
    totalPoints
    updatedAt
  }
}
```
Respuesta:
```json
{
  "data": {
    "getUserPoints": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Juan Pérez",
      "totalPoints": 150.5,
      "updatedAt": "2024-03-20T15:30:00Z"
    }
  }
}
```

### 3. Redimir Recompensa
```graphql
mutation {
  redeemPoints(userId: "550e8400-e29b-41d4-a716-446655440000", rewardId: "123e4567-e89b-12d3-a456-426614174000") {
    id
    points
    type
    description
  }
}
```
Respuesta:
```json
{
  "data": {
    "redeemPoints": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "points": -50,
      "type": "redeem",
      "description": "Redención: Descuento 10%"
    }
  }
}
```

## 👨‍💻 Desarrollo

### Estructura del Proyecto
```
points-api/
├── src/
│   ├── users/                 # Módulo de usuarios
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entities/         # Entidades
│   │   ├── users.service.ts  # Lógica de negocio
│   │   └── users.resolver.ts # Resolvers GraphQL
│   ├── transactions/         # Módulo de transacciones
│   ├── rewards/             # Módulo de recompensas
│   ├── common/              # Código compartido
│   │   ├── decorators/      # Decoradores personalizados
│   │   ├── filters/         # Filtros de excepciones
│   │   ├── guards/          # Guards de autenticación
│   │   ├── interceptors/    # Interceptores
│   │   └── services/        # Servicios compartidos
│   └── config/              # Configuración
├── database/                # Scripts de base de datos
├── test/                   # Pruebas
└── cloud-functions/        # Cloud Functions
```

### Comandos de Desarrollo
```bash
# Iniciar en modo desarrollo
npm run start:dev

# Compilar
npm run build

# Ejecutar pruebas
npm run test

# Ejecutar linting
npm run lint

# Generar documentación
npm run docs:generate
```

## 🚀 Despliegue

### Despliegue en Google Cloud Run

1. **Configurar Google Cloud**
```bash
gcloud config set project your-project-id
```

2. **Construir y subir imagen**
```bash
gcloud builds submit --tag gcr.io/your-project-id/points-api
```

3. **Desplegar en Cloud Run**
```bash
gcloud run deploy points-api \
  --image gcr.io/your-project-id/points-api \
  --platform managed \
  --region your-region \
  --allow-unauthenticated
```

### Despliegue en Render

1. Conectar repositorio en Render
2. Configurar variables de entorno
3. Seleccionar "Web Service"
4. Configurar:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Configuración del Proyecto

### 1. API GraphQL (NestJS)

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

### 2. Cloud Function

```bash
# Navegar al directorio de la función
cd cloud-functions/register-points

# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Despliegue
npm run deploy
```
