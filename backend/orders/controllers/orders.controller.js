import Pedido, { ESTADOS } from '../models/Pedido.js';

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

// Valida cada item contra product-service y retorna items enriquecidos
const validarItems = async (items, token) => {
  const resultados = await Promise.all(
    items.map(async (item) => {
      const res = await fetch(
        `${PRODUCT_URL}/productos/${item.productoId}/disponibilidad?cantidad=${item.cantidad}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!data.disponible) throw new Error(`Producto ${item.productoId}: ${data.error}`);
      return {
        productoId: item.productoId,
        nombre: data.producto.nombre,
        precio: data.producto.precio,
        cantidad: item.cantidad,
      };
    })
  );
  return resultados;
};

// Este apartado descuenta articulos en inventario en product-service por cada articulo confirmado
const descontarStock = async (items, token) => {
  await Promise.all(
    items.map((item) =>
      fetch(`${PRODUCT_URL}/productos/${item.productoId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cantidad: item.cantidad }),
      })
    )
  );
};

// POST /ordenes
export const crearOrden = async (req, res) => {
  try {
    const { items, notas } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un item' });
    }

    const token = req.headers['authorization']?.split(' ')[1];
    const itemsValidados = await validarItems(items, token);
    await descontarStock(itemsValidados, token);

    const pedido = Pedido.create({
      usuarioId: req.usuario.id,
      usuarioNombre: req.usuario.email,
      items: itemsValidados,
      notas,
    });

    return res.status(201).json({ message: 'Orden creada exitosamente', pedido });
  } catch (error) {
    console.error('Error en crearOrden:', error.message);
    return res.status(400).json({ error: error.message });
  }
};

// GET /ordenes  — administrador ve todas, cliente solo las suyas
export const listarOrdenes = (req, res) => {
  try {
    const filtros = req.usuario.rol === 'admin' ? req.query : { ...req.query, usuarioId: req.usuario.id };
    const pedidos = Pedido.findAll(filtros);
    return res.status(200).json({ pedidos });
  } catch (error) {
    console.error('Error en listarOrdenes:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /ordenes/:id
export const obtenerOrden = (req, res) => {
  try {
    const pedido = Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Orden no encontrada' });
    // Un cliente solo puede ver sus propias ordenes
    if (req.usuario.rol !== 'admin' && pedido.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta orden' });
    }
    return res.status(200).json({ pedido });
  } catch (error) {
    console.error('Error en obtenerOrden:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PATCH /ordenes/:id/estado  (admin)
export const actualizarEstado = (req, res) => {
  try {
    const { estado } = req.body;
    if (!Object.values(ESTADOS).includes(estado)) {
      return res.status(400).json({ error: `Estado invalido. Valores posibles: ${Object.values(ESTADOS).join(', ')}` });
    }
    const pedido = Pedido.updateEstado(req.params.id, estado);
    if (!pedido) return res.status(404).json({ error: 'Orden no encontrada' });
    return res.status(200).json({ message: 'Estado actualizado', pedido });
  } catch (error) {
    console.error('Error en actualizarEstado:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /ordenes/:id  — cancela si esta pendiente
export const cancelarOrden = (req, res) => {
  try {
    const existente = Pedido.findById(req.params.id);
    if (!existente) return res.status(404).json({ error: 'Orden no encontrada' });
    if (req.usuario.rol !== 'admin' && existente.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }
    const resultado = Pedido.delete(req.params.id);
    if (resultado === null) return res.status(400).json({ error: 'Solo se pueden cancelar ordenes pendientes' });
    return res.status(200).json({ message: 'Orden cancelada', pedido: resultado });
  } catch (error) {
    console.error('Error en cancelarOrden:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};