interface EnvironmentVariables {
  PORT?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
  NODE_ENV?: string;
  MONGODB_URI: string;
  CLOUD_FUNCTION_URL?: string;
}

const validateEnv = () => {
  const required: Array<keyof EnvironmentVariables> = ['MONGODB_URI'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
  }
};

export default () => {
  validateEnv();

  const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

  return {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: dbPort,
    DB_USERNAME: process.env.DB_USERNAME || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME || 'points_db',

    MONGODB_URI: process.env.MONGODB_URI,

    NODE_ENV: process.env.NODE_ENV || 'development',

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
