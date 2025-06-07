// Definimos un tipo para asegurar que las variables requeridas existan
interface EnvironmentVariables {
  PORT?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
  NODE_ENV?: string;
  MONGODB_URI: string; // Ahora es requerida
  CLOUD_FUNCTION_URL?: string; // Ya no es requerida
}

// Validamos las variables de entorno requeridas
const validateEnv = () => {
  const required: Array<keyof EnvironmentVariables> = ['MONGODB_URI']; // Solo requerimos MongoDB
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
  }
};

export default () => {
  // Validar variables de entorno al iniciar
  validateEnv();

  const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

  return {
    // PostgreSQL
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: dbPort,
    DB_USERNAME: process.env.DB_USERNAME || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME || 'points_db',

    // MongoDB (ahora requerida)
    MONGODB_URI: process.env.MONGODB_URI,

    // Ambiente
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Configuración existente
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: dbPort,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME || 'points_db',
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    cloudFunction: {
      url: process.env.CLOUD_FUNCTION_URL,
    },
  };
}; 