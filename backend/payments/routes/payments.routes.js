import { Router } from 'express';
import {
  procesarPago,
  listarPagos,
  obtenerPago,
  obtenerPagoPorOrden,
  actualizarEstadoPago,
} from '../controllers/paymentController.js';
import { verificarToken, soloAdmin } from '../middleware/auth.js';
 
const router = Router();
 
router.use(verificarToken);
 
router.get('/', listarPagos);
router.get('/orden/:ordenId', obtenerPagoPorOrden); // debe ir ANTES de /:id (evitar conflicto de rutas)
router.get('/:id', obtenerPago);
router.post('/', procesarPago);
router.patch('/:id/estado', soloAdmin, actualizarEstadoPago);
 
export default router;