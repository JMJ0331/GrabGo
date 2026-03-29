import Producto from '../models/Producto.js';

// GET /productos
export const listarProductos = (req, res) => {
  try {
    const { categoria, disponible } = req.query;
    const productos = Producto.findAll({ categoria, disponible });
    return res.status(200).json({ productos });
  } catch (error) {
    console.error('Error en listarProductos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /productos/:id
export const obtenerProducto = (req, res) => {
  try {
    const producto = Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.status(200).json({ producto });
  } catch (error) {
    console.error('Error en obtenerProducto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /productos  (solo admin)
export const crearProducto = (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, stock } = req.body;
    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ error: 'Nombre, precio y categoria son requeridos' });
    }
    const producto = Producto.create({ nombre, descripcion, precio: parseFloat(precio), categoria, stock: parseInt(stock) || 0 });
    return res.status(201).json({ message: 'Producto creado', producto });
  } catch (error) {
    console.error('Error en crearProducto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /productos/:id  (solo admin)
export const actualizarProducto = (req, res) => {
  try {
    const producto = Producto.update(req.params.id, req.body);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.status(200).json({ message: 'Producto actualizado', producto });
  } catch (error) {
    console.error('Error en actualizarProducto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /productos/:id  (solo admin)
export const eliminarProducto = (req, res) => {
  try {
    const eliminado = Producto.delete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error en eliminarProducto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /productos/:id/disponibilidad  (usado por order-service)
export const verificarDisponibilidad = (req, res) => {
  try {
    const { cantidad = 1 } = req.query;
    const resultado = Producto.verificarDisponibilidad(req.params.id, parseInt(cantidad));
    return res.status(resultado.disponible ? 200 : 400).json(resultado);
  } catch (error) {
    console.error('Error en verificarDisponibilidad:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PATCH /productos/:id/stock  (llamado internamente por order-service)
export const reducirStock = (req, res) => {
  try {
    const { cantidad } = req.body;
    if (!cantidad || cantidad < 1) return res.status(400).json({ error: 'Cantidad invalida' });
    const producto = Producto.reducirStock(req.params.id, parseInt(cantidad));
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.status(200).json({ message: 'Stock actualizado', producto });
  } catch (error) {
    console.error('Error en reducirStock:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};