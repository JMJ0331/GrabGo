import express from 'express';
import { config } from 'dotenv';
import productRoutes from './src/routes/productRoutes.js';

config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'product-service', port: PORT });
});

app.use('/productos', productRoutes);

app.get('/', (req, res) => {
  res.json({
    service: 'product-service',
    version: '1.0.0',
    endpoints: [
      'GET    /productos',
      'GET    /productos/:id',
      'GET    /productos/:id/disponibilidad',
      'POST   /productos          (admin)',
      'PUT    /productos/:id      (admin)',
      'DELETE /productos/:id      (admin)',
      'PATCH  /productos/:id/stock',
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` });
});

app.listen(PORT, () => {
  console.log(`product-service ejecutandose en http://localhost:${PORT}`);
});