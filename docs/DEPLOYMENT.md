# Guía de Despliegue

## 📋 Índice
- [Preparación](#preparación)
- [Despliegue en Google Cloud Run](#despliegue-en-google-cloud-run)
- [Despliegue en Render](#despliegue-en-render)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Mantenimiento](#mantenimiento)

## 🚀 Preparación

### 1. Requisitos Previos
- Cuenta de Google Cloud Platform
- Cuenta de Render (opcional)
- Docker instalado
- Google Cloud SDK instalado
- Acceso a las bases de datos

### 2. Configuración de Variables de Entorno
```env
# Producción
NODE_ENV=production
PORT=8080

# PostgreSQL
POSTGRES_HOST=your-production-db-host
POSTGRES_PORT=5432
POSTGRES_DB=points_db
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=your-secure-password

# MongoDB
MONGODB_URI=mongodb+srv://prod_user:password@cluster.mongodb.net/points_logs

# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
CLOUD_FUNCTION_URL=https://your-region-your-project.cloudfunctions.net/register-points

# BigQuery
BIGQUERY_DATASET=points_system
BIGQUERY_TABLE=points_transactions
```

### 3. Preparar la Aplicación
```bash
# Construir la aplicación
npm run build

# Ejecutar pruebas
npm run test

# Verificar linting
npm run lint
```

## 🚢 Despliegue en Google Cloud Run

### 1. Configurar Google Cloud

```bash
# Iniciar sesión
gcloud auth login

# Configurar proyecto
gcloud config set project your-project-id

# Habilitar APIs necesarias
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

### 2. Configurar Secretos

```bash
# Crear secretos
gcloud secrets create postgres-password --data-file=/path/to/password.txt
gcloud secrets create mongodb-uri --data-file=/path/to/mongodb-uri.txt

# Dar acceso al servicio
gcloud secrets add-iam-policy-binding postgres-password \
  --member="serviceAccount:your-service-account@your-project.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Construir y Subir Imagen

```bash
# Construir imagen
gcloud builds submit --tag gcr.io/your-project-id/points-api

# Verificar imagen
gcloud container images list-tags gcr.io/your-project-id/points-api
```

### 4. Desplegar en Cloud Run

```bash
gcloud run deploy points-api \
  --image gcr.io/your-project-id/points-api \
  --platform managed \
  --region your-region \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="POSTGRES_PASSWORD=postgres-password:latest,MONGODB_URI=mongodb-uri:latest"
```

### 5. Configurar Dominio Personalizado

```bash
# Mapear dominio
gcloud beta run domain-mappings create \
  --service points-api \
  --domain your-domain.com \
  --region your-region
```

## 🎯 Despliegue en Render

### 1. Preparar Render.yaml

```yaml
services:
  - type: web
    name: points-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: POSTGRES_HOST
        sync: false
      - key: POSTGRES_PASSWORD
        sync: false
```

### 2. Desplegar en Render

1. Conectar repositorio en Render
2. Seleccionar "Web Service"
3. Configurar:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Environment: `production`

### 3. Configurar Variables de Entorno

En el dashboard de Render:
1. Ir a Environment
2. Agregar variables:
   - `NODE_ENV=production`
   - `POSTGRES_HOST=your-db-host`
   - `POSTGRES_PASSWORD=your-password`
   - Otras variables necesarias

## 📊 Monitoreo y Logs

### 1. Google Cloud Monitoring

```bash
# Habilitar monitoreo
gcloud services enable monitoring.googleapis.com

# Configurar alertas
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring-policy.yaml
```

### 2. Logs

#### Cloud Run Logs
```bash
# Ver logs en tiempo real
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=points-api"

# Ver logs de errores
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=points-api AND severity>=ERROR"
```

#### MongoDB Logs
```bash
# Ver logs de transacciones
mongosh "mongodb+srv://cluster.mongodb.net/points_logs" \
  --eval 'db.transaction_logs.find().sort({timestamp: -1}).limit(10)'
```

#### BigQuery Logs
```sql
-- Consultar logs de transacciones
SELECT 
  user_id,
  points,
  type,
  timestamp,
  processed_at
FROM `points_system.points_transactions`
WHERE DATE(timestamp) = CURRENT_DATE()
ORDER BY timestamp DESC
LIMIT 100;
```

### 3. Métricas Clave

1. **Rendimiento**
   - Tiempo de respuesta
   - Tasa de errores
   - Uso de CPU/Memoria

2. **Negocio**
   - Puntos acumulados
   - Redenciones realizadas
   - Usuarios activos

## 🔧 Mantenimiento

### 1. Actualizaciones

```bash
# Actualizar aplicación
git pull origin main
npm install
npm run build
gcloud builds submit --tag gcr.io/your-project-id/points-api

# Actualizar Cloud Run
gcloud run services update points-api \
  --image gcr.io/your-project-id/points-api:latest
```

### 2. Backups

#### PostgreSQL
```bash
# Backup manual
pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER $POSTGRES_DB > backup.sql

# Restaurar
psql -h $POSTGRES_HOST -U $POSTGRES_USER $POSTGRES_DB < backup.sql
```

#### MongoDB
```bash
# Backup
mongodump --uri="$MONGODB_URI" --out=backup

# Restaurar
mongorestore --uri="$MONGODB_URI" backup
```

### 3. Escalado

```bash
# Ajustar instancias
gcloud run services update points-api \
  --min-instances=2 \
  --max-instances=10 \
  --cpu=1 \
  --memory=512Mi
```

## 🔐 Seguridad

### 1. Certificados SSL
```bash
# Verificar certificados
gcloud beta run domain-mappings describe \
  --domain your-domain.com \
  --region your-region
```

### 2. Firewall
```bash
# Configurar reglas de firewall
gcloud compute firewall-rules create allow-points-api \
  --allow tcp:8080 \
  --target-tags=points-api \
  --description="Allow traffic to Points API"
```

### 3. Auditoría
```bash
# Ver logs de auditoría
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=points-api AND protoPayload.methodName=google.cloud.run.v1.Services.Update"
```

## 📝 Endpoints y Documentación

### GraphQL Endpoints
```
Producción: https://your-domain.com/graphql
Desarrollo: http://localhost:3000/graphql
```

### Cloud Functions
```
Registrar Puntos: https://your-region-your-project.cloudfunctions.net/register-points
```

### Documentación de API
```
Swagger UI: https://your-domain.com/api
GraphQL Playground: https://your-domain.com/graphql
```

## 🚨 Solución de Problemas

### 1. Verificar Estado
```bash
# Estado del servicio
gcloud run services describe points-api

# Logs de errores
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=points-api AND severity>=ERROR" --limit=10
```

### 2. Problemas Comunes

1. **Error de Conexión a Base de Datos**
   - Verificar credenciales
   - Comprobar firewall
   - Revisar logs de PostgreSQL

2. **Errores 500**
   - Revisar logs de aplicación
   - Verificar variables de entorno
   - Comprobar dependencias

3. **Problemas de Rendimiento**
   - Monitorear uso de recursos
   - Revisar consultas a base de datos
   - Ajustar configuración de escalado 