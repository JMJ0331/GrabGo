import { readDB, writeDB } from "../models/payments.model.js";

const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL || "http://localhost:3003";
const METODOS_VALIDOS = ["tarjeta", "efectivo", "transferencia"];

// 📌 Procesar pago
export async function procesarPago(req, res) {
    try {
        const db = await readDB();
        const { orderId, metodo } = req.body;

        // Validar campos requeridos
        if (!orderId) {
            return res.status(400).json({ error: "El campo orderId es requerido" });
        }

        // Validar método de pago
        const metodoPago = metodo || "tarjeta";
        if (!METODOS_VALIDOS.includes(metodoPago)) {
            return res.status(400).json({
                error: `Método de pago inválido. Los métodos permitidos son: ${METODOS_VALIDOS.join(", ")}`
            });
        }

        // Verificar que no exista ya un pago para esa orden
        const pagoExistente = db.pagos.find(p => p.orderId == orderId);
        if (pagoExistente) {
            return res.status(409).json({ error: "Ya existe un pago registrado para esta orden" });
        }

        const nuevoPago = {
            id: Date.now(),
            orderId,
            metodo: metodoPago,
            estado: "completado",
            fecha: new Date().toISOString()
        };

        db.pagos.push(nuevoPago);
        await writeDB(db);

        // 🔗 Llamar al OrdersService para actualizar el estado de la orden
        // Se reutiliza el token JWT del usuario autenticado
        try {
            const response = await fetch(`${ORDERS_SERVICE_URL}/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${req.token}`
                },
                body: JSON.stringify({ estado: "completado" })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.warn(`Advertencia: No se pudo actualizar la orden ${orderId}:`, errorData);
            }
        } catch (error) {
            // El pago ya se registró — solo logueamos el error de comunicación
            console.error("Error comunicándose con OrdersService:", error.message);
        }

        return res.status(201).json(nuevoPago);

    } catch (error) {
        console.error("Error en procesarPago:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Listar pagos
export async function getPagos(req, res) {
    try {
        const db = await readDB();
        return res.status(200).json(db.pagos);
    } catch (error) {
        console.error("Error en getPagos:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Obtener pago por ID
export async function getPagoById(req, res) {
    try {
        const db = await readDB();
        const pago = db.pagos.find(p => p.id == req.params.id);

        if (!pago) {
            return res.status(404).json({ error: "Pago no encontrado" });
        }

        return res.status(200).json(pago);

    } catch (error) {
        console.error("Error en getPagoById:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}