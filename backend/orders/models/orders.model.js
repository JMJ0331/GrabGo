//Order Services - Modelo de datos y lógica de negocio para pedidos

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '../db/pedidos.json');

// Estados validos del ciclo de vida de un pedido
export const ESTADOS = {
  PENDIENTE: 'pendiente',
  CONFIRMADO: 'confirmado',
  PREPARANDO: 'preparando',
  LISTO: 'listo',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado',
};

const leerPedidos = () => {
  try {
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const guardarPedidos = (pedidos) => {
  writeFileSync(DB_PATH, JSON.stringify(pedidos, null, 2), 'utf-8');
};

const Pedido = {
  findAll(filtros = {}) {
    let pedidos = leerPedidos();
    if (filtros.usuarioId) pedidos = pedidos.filter((p) => p.usuarioId === filtros.usuarioId);
    if (filtros.estado) pedidos = pedidos.filter((p) => p.estado === filtros.estado);
    return pedidos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findById(id) {
    return leerPedidos().find((p) => p.id === id) || null;
  },

  create(datos) {
    const pedidos = leerPedidos();
    const subtotal = datos.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const impuesto = parseFloat((subtotal * 0.18).toFixed(2)); // ITBIS 18%
    const total = parseFloat((subtotal + impuesto).toFixed(2));

    const nuevoPedido = {
      id: Date.now().toString(),
      usuarioId: datos.usuarioId,
      usuarioNombre: datos.usuarioNombre,
      items: datos.items,
      subtotal,
      impuesto,
      total,
      estado: ESTADOS.PENDIENTE,
      notas: datos.notas || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    pedidos.push(nuevoPedido);
    guardarPedidos(pedidos);
    return nuevoPedido;
  },

  updateEstado(id, estado) {
    const pedidos = leerPedidos();
    const index = pedidos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    pedidos[index].estado = estado;
    pedidos[index].updatedAt = new Date().toISOString();
    guardarPedidos(pedidos);
    return pedidos[index];
  },

  delete(id) {
    const pedidos = leerPedidos();
    const index = pedidos.findIndex((p) => p.id === id);
    if (index === -1) return false;
    // Solo se puede cancelar si esta pendiente
    if (pedidos[index].estado !== ESTADOS.PENDIENTE) return null;
    pedidos[index].estado = ESTADOS.CANCELADO;
    pedidos[index].updatedAt = new Date().toISOString();
    guardarPedidos(pedidos);
    return pedidos[index];
  },
};

export default Pedido;