# Files to projec

```ts
// src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
```

```ts
// src/config/env.ts
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  // Añadir más variables de entorno según sea necesario
};

// Validar variables de entorno requeridas
const requiredEnvVars = ['DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

```ts
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log el error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
  });

  // En desarrollo, incluir el stack trace
  const response = {
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(response);
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  });
};
```

```ts
// src/utils/logger.ts
import winston from 'winston';
import { env } from '../config/env';

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Añadir más transportes según sea necesario (archivo, etc.)
  ],
});

export default logger;
```