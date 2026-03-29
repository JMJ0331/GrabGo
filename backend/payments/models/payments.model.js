import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '../db/pagos.json');

export const METODOS = { EFECTIVO: 'efectivo', TARJETA: 'tarjeta', APPLE_PAY: 'apple_pay', GOOGLE_PAY: 'google_pay' };
export const ESTADOS_PAGO = { PENDIENTE: 'pendiente', COMPLETADO: 'completado', FALLIDO: 'fallido', REEMBOLSADO: 'reembolsado' };

const leerPagos = () => {
  try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')); } catch { return []; }
};
const guardarPagos = (pagos) => {
  writeFileSync(DB_PATH, JSON.stringify(pagos, null, 2), 'utf-8');
};

const Pago = {
  findAll(filtros = {}) {
    let pagos = leerPagos();
    if (filtros.usuarioId) pagos = pagos.filter((p) => p.usuarioId === filtros.usuarioId);
    if (filtros.ordenId) pagos = pagos.filter((p) => p.ordenId === filtros.ordenId);
    return pagos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findById(id) {
    return leerPagos().find((p) => p.id === id) || null;
  },

  findByOrdenId(ordenId) {
    return leerPagos().find((p) => p.ordenId === ordenId) || null;
  },

  create(datos) {
    const pagos = leerPagos();

    // Simulacion: tarjeta/digital siempre aprueba, efectivo queda pendiente
    
    const estadoInicial =
      datos.metodo === METODOS.EFECTIVO ? ESTADOS_PAGO.PENDIENTE : ESTADOS_PAGO.COMPLETADO;

    const nuevoPago = {
      id: Date.now().toString(),
      ordenId: datos.ordenId,
      usuarioId: datos.usuarioId,
      monto: datos.monto,
      metodo: datos.metodo,
      estado: estadoInicial,
      referencia: `TXN-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    pagos.push(nuevoPago);
    guardarPagos(pagos);
    return nuevoPago;
  },

  updateEstado(id, estado) {
    const pagos = leerPagos();
    const index = pagos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    pagos[index].estado = estado;
    pagos[index].updatedAt = new Date().toISOString();
    guardarPagos(pagos);
    return pagos[index];
  },
};

export default Pago;