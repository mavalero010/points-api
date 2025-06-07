# Guía de Desarrollo

## 🛠️ Configuración del Entorno de Desarrollo

### Requisitos Previos
- Node.js v14+
- PostgreSQL 12+
- MongoDB 4.4+
- Docker (opcional)
- Google Cloud SDK
- Visual Studio Code (recomendado)

### Extensiones Recomendadas para VS Code
- ESLint
- Prettier
- GraphQL
- Docker
- GitLens

### Configuración Inicial

1. **Clonar y Configurar**
```bash
git clone https://github.com/your-username/points-api.git
cd points-api
npm install
```

2. **Configurar Variables de Entorno**
```bash
cp .env.example .env
```

3. **Iniciar Servicios con Docker**
```bash
docker-compose up -d
```

## 📚 Estructura del Proyecto

### Directorios Principales

```
src/
├── users/                 # Módulo de usuarios
│   ├── dto/              # Data Transfer Objects
│   │   ├── create-user.input.ts
│   │   └── user-points.response.ts
│   ├── entities/         # Entidades
│   │   └── user.entity.ts
│   ├── users.service.ts  # Lógica de negocio
│   └── users.resolver.ts # Resolvers GraphQL
├── transactions/         # Módulo de transacciones
├── rewards/             # Módulo de recompensas
└── common/              # Código compartido
    ├── decorators/      # Decoradores personalizados
    ├── filters/         # Filtros de excepciones
    ├── guards/          # Guards de autenticación
    ├── interceptors/    # Interceptores
    └── services/        # Servicios compartidos
```

### Convenciones de Código

1. **Nombres de Archivos**
   - Entidades: `*.entity.ts`
   - DTOs: `*.input.ts` o `*.response.ts`
   - Servicios: `*.service.ts`
   - Resolvers: `*.resolver.ts`

2. **Decoradores**
   - Usar `@Injectable()` para servicios
   - Usar `@Resolver()` para resolvers GraphQL
   - Usar `@Entity()` para entidades
   - Usar `@Field()` para campos GraphQL

3. **Documentación**
   - Documentar todas las clases y métodos públicos
   - Usar JSDoc para documentación
   - Incluir ejemplos en la documentación

## 🔄 Flujo de Desarrollo

### 1. Crear Nueva Característica

1. **Crear Rama**
```bash
git checkout -b feature/nueva-caracteristica
```

2. **Desarrollar**
   - Crear/modificar entidades
   - Implementar servicios
   - Agregar resolvers GraphQL
   - Escribir pruebas

3. **Pruebas**
```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas e2e
npm run test:e2e

# Verificar cobertura
npm run test:cov
```

4. **Linting y Formateo**
```bash
# Verificar linting
npm run lint

# Formatear código
npm run format
```

### 2. Proceso de Commit

1. **Preparar Cambios**
```bash
git add .
git status
```

2. **Crear Commit**
```bash
git commit -m "feat: descripción de la característica

- Detalle 1
- Detalle 2"
```

3. **Push y Pull Request**
```bash
git push origin feature/nueva-caracteristica
```

## 🧪 Testing

### Pruebas Unitarias

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Agregar más pruebas...
});
```

### Pruebas E2E

```typescript
// users.e2e-spec.ts
describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/graphql (POST)', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            getUsers {
              id
              name
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.getUsers).toBeDefined();
      });
  });
});
```

## 🔍 Debugging

### VS Code

1. **Configuración de Launch**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/main.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

2. **Puntos de Interrupción**
   - Usar `debugger;` en el código
   - Configurar breakpoints en VS Code
   - Usar el panel de Debug

### Logging

```typescript
// Ejemplo de logging en un servicio
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async createUser(input: CreateUserInput): Promise<User> {
    this.logger.debug(`Creando usuario: ${JSON.stringify(input)}`);
    try {
      // ... lógica de creación
      this.logger.log(`Usuario creado: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error al crear usuario: ${error.message}`);
      throw error;
    }
  }
}
```

## 📦 Gestión de Dependencias

### Actualizar Dependencias

1. **Verificar Actualizaciones**
```bash
npm outdated
```

2. **Actualizar Dependencias**
```bash
# Actualizar una dependencia específica
npm update @nestjs/core

# Actualizar todas las dependencias
npm update
```

3. **Auditar Seguridad**
```bash
npm audit
npm audit fix
```

## 🔄 CI/CD

### GitHub Actions

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Run linting
      run: npm run lint
```

## 📚 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de GraphQL](https://graphql.org/learn/)
- [Documentación de TypeORM](https://typeorm.io/)
- [Guía de Estilo de TypeScript](https://google.github.io/styleguide/tsguide.html) 