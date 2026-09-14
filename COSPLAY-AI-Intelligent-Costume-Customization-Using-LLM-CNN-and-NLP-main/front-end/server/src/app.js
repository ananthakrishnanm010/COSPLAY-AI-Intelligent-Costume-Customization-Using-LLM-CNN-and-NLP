import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Global Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Base Route - Server health check
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the Cosplay E-commerce API',
    status: 'healthy',
    version: 'v1',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'The requested endpoint does not exist.',
  });
});

// Global Error Handling Middleware
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: err.status || 'error',
    statusCode,
    message: err.message || 'Internal Server Error',
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
