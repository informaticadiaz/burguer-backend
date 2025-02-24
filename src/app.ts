// src/app.ts
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import menuRoutes from './routes/menuRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import customizationRoutes from './routes/customizationRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

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
app.use('/api/categories', categoryRoutes);
app.use('/api/customizations', customizationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const port = env.PORT;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

export default app;