import express from 'express';
import { config } from 'dotenv';
import orderRoutes from './src/routes/orderRoutes.js';

config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'order-service', port: PORT });
});

app.use('/ordenes', orderRoutes);

app.get('/', (req, res) => {
  res.json({
    service: 'order-service',
    version: '1.0.0',
    endpoints: [
      'GET    /ordenes            (token)',
      'GET    /ordenes/:id        (token)',
      'POST   /ordenes            (token)',
      'PATCH  /ordenes/:id/estado (admin)',
      'DELETE /ordenes/:id        (token)',
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` });
});

app.listen(PORT, () => {
  console.log(`order-service ejecutandose en http://localhost:${PORT}`);
});