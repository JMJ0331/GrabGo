// controllers/paymentController.js
// Lógica de negocio del servicio de pagos.
// Calcula subtotal, impuestos y total automáticamente desde los items.

const Payment = require('../models/Payment');

// ── Registrar pago ────────────────────────────────────────────────────────────
// Se activa cuando el usuario pulsa "Proceder a pagar", "Apple Pay" o "Google Pay"

const createPayment = async (req, res) => {
  try {
    const { orderId, userId, items, method, taxRate } = req.body;

    // Calcular resumen financiero (panel derecho de la UI)

    const effectiveTaxRate = taxRate ?? 0.18;
    const subtotal  = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = Math.round(subtotal * effectiveTaxRate);
    const total     = subtotal + taxAmount;

    const payment = await Payment.create({
      orderId,
      userId,
      items,
      subtotal,
      taxRate: effectiveTaxRate,
      taxAmount,
      total,
      method,
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Listar todos los pagos ────────────────────────────────────────────────────
const getPayments = async (_req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Obtener un pago por ID ────────────────────────────────────────────────────
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Obtener pago por orden ────────────────────────────────────────────────────
// Útil para que el orders-service consulte si una orden ya fue pagada

const getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) return res.status(404).json({ success: false, message: 'Pago no encontrado para esta orden' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Actualizar estado del pago ────────────────────────────────────────────────
// ej: de "pendiente" a "completado" o "fallido"

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Eliminar pago (solo para admin / correcciones) ────────────────────────────
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    res.json({ success: true, message: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  getPaymentByOrder,
  updatePaymentStatus,
  deletePayment,
};