import { Router } from 'express';
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  verificarDisponibilidad,
  reducirStock,
} from '../controllers/productController.js';
import { verificarToken, soloAdmin } from '../middleware/auth.js';

const router = Router();

// Rutas publicas (el menu se puede ver sin login)
router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
router.get('/:id/disponibilidad', verificarDisponibilidad);

// Rutas de administrador
router.post('/', verificarToken, soloAdmin, crearProducto);
router.put('/:id', verificarToken, soloAdmin, actualizarProducto);
router.delete('/:id', verificarToken, soloAdmin, eliminarProducto);

// Ruta interna (llamada por order-service con token de servicio)
router.patch('/:id/stock', verificarToken, reducirStock);

export default router;