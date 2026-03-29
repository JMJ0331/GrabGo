import { Router } from 'express';
import { crearOrden, listarOrdenes, obtenerOrden, actualizarEstado, cancelarOrden } from '../controllers/orderController.js';
import { verificarToken, soloAdmin } from '../middleware/auth.js';

const router = Router();

router.use(verificarToken); // Todas las rutas de ordenes requieren token

router.get('/', listarOrdenes);
router.get('/:id', obtenerOrden);
router.post('/', crearOrden);
router.patch('/:id/estado', soloAdmin, actualizarEstado);
router.delete('/:id', cancelarOrden);

export default router;