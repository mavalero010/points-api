# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY src/ ./src/
COPY test/ ./test/

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"] 