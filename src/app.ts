// src/app.ts
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import menuRoutes from './routes/menuRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/menu-items', menuRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const port = env.PORT;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;