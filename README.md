# 🎯 Sistema de Puntos API

API GraphQL para sistema de fidelidad con puntos, transacciones y recompensas.

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## 🏗️ Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Cliente   │     │   API       │     │   Cloud     │
│   (Frontend)│────▶│   GraphQL   │────▶│   Functions │
└─────────────┘     └─────┬───────┘     └─────────────┘
                          │
                  ┌───────┴───────┐
                  │  PostgreSQL   │
                  │  MongoDB      │
                  └───────────────┘
```

## 🚀 Características Principales

### 💰 Gestión de Puntos
- Registro de compras
- Canje de recompensas
- Historial de transacciones
- Saldo de puntos

### 🎁 Recompensas
- Catálogo de recompensas
- Validación de stock
- Control de puntos necesarios
- Estado activo/inactivo

### 👤 Usuarios
- Registro de usuarios
- Consulta de saldo
- Historial personal
- Validaciones de datos

## ⚡ Implementación Técnica

### 🛠️ Tecnologías
- **Backend**: NestJS + GraphQL
- **Bases de Datos**: PostgreSQL + MongoDB
- **Cloud**: Google Cloud Functions
- **Validación**: class-validator + GraphQL

### 🔒 Seguridad y Validaciones
- Validación de datos de entrada
- Filtros de excepciones
- Interceptores personalizados
- Logs estructurados

## 📝 Ejemplos de Uso

### Registrar Compra
```graphql
mutation {
  registerPurchase(
    userId: "bc1c6128-1080-44ec-825e-e5cec83472fb", 
    amount: 100.50
  ) {
    points
    type
    description
  }
}
```

### Canjear Recompensa
```graphql
mutation {
  redeemPoints(
    userId: "bc1c6128-1080-44ec-825e-e5cec83472fb",
    rewardId: "469cdb61-a7cf-499b-96e0-31c3ec9a1bb8"
  ) {
    points
    type
    description
  }
}
```

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/your-username/points-api.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en desarrollo
npm run start:dev
```

## ⚙️ Configuración

### Variables de Entorno
```env
# Servidor
PORT=3000
NODE_ENV=development

# Bases de Datos
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
MONGODB_URI=mongodb://localhost:27017/points_logs

# Cloud
CLOUD_FUNCTION_URL=https://your-region-your-project.cloudfunctions.net/register-points
```

## 🛠️ Desarrollo

### Comandos Útiles
```bash
# Desarrollo
npm run start:dev

# Compilación
npm run build

# Pruebas
npm run test

# Linting
npm run lint
```

## 📚 Estructura del Proyecto
```
points-api/
├── src/
│   ├── users/          # Módulo de usuarios
│   ├── transactions/   # Módulo de transacciones
│   ├── rewards/        # Módulo de recompensas
│   ├── common/         # Código compartido
│   └── config/         # Configuración
├── database/           # Scripts de BD
└── cloud-functions/    # Cloud Functions
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte, email: soporte@tudominio.com o abre un issue en el repositorio.
