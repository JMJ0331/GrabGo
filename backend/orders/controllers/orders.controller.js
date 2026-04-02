import { readDB, writeDB } from "../models/orders.model.js";

const ESTADOS_VALIDOS = ["pendiente", "en proceso", "completado", "cancelado"];

// 📌 Crear pedido
export async function createOrder(req, res) {
    try {
        const db = await readDB();
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío o tiene formato inválido" });
        }

        // Validar estructura de cada item
        for (const item of items) {
            if (!item.nombre || item.precio == null || item.cantidad == null) {
                return res.status(400).json({ error: "Cada item debe tener nombre, precio y cantidad" });
            }
            if (typeof item.precio !== "number" || typeof item.cantidad !== "number") {
                return res.status(400).json({ error: "precio y cantidad deben ser números" });
            }
            if (item.precio < 0 || item.cantidad <= 0) {
                return res.status(400).json({ error: "precio y cantidad deben ser valores positivos" });
            }
        }

        const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        const newOrder = {
            id: Date.now(),
            items,
            total: parseFloat(total.toFixed(2)),
            estado: "pendiente",
            fecha: new Date().toISOString()
        };

        db.orders.push(newOrder);
        await writeDB(db);

        return res.status(201).json(newOrder);

    } catch (error) {
        console.error("Error en createOrder:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Listar pedidos
export async function getOrders(req, res) {
    try {
        const db = await readDB();
        return res.status(200).json(db.orders);
    } catch (error) {
        console.error("Error en getOrders:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Detalle de pedido
export async function getOrderById(req, res) {
    try {
        const db = await readDB();
        const order = db.orders.find(o => o.id == req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        return res.status(200).json(order);

    } catch (error) {
        console.error("Error en getOrderById:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Cambiar estado
export async function updateOrderStatus(req, res) {
    try {
        const db = await readDB();
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ error: "El campo estado es requerido" });
        }

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({
                error: `Estado inválido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(", ")}`
            });
        }

        const order = db.orders.find(o => o.id == req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        order.estado = estado;
        order.updatedAt = new Date().toISOString();

        await writeDB(db);

        return res.status(200).json(order);

    } catch (error) {
        console.error("Error en updateOrderStatus:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}