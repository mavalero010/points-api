# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY src/ ./src/
COPY scripts/ ./scripts/

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["npm", "run", "serve"] 