import { readDB, writeDB } from "../models/products.model.js";

// 📌 Listar todos los productos
export async function getProductos(req, res) {
    try {
        const db = await readDB();
        return res.status(200).json(db.productos);
    } catch (error) {
        console.error("Error en getProductos:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Obtener producto por ID
export async function getProductoById(req, res) {
    try {
        const db = await readDB();
        const producto = db.productos.find(p => p.id == req.params.id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        return res.status(200).json(producto);
    } catch (error) {
        console.error("Error en getProductoById:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Crear producto
export async function createProducto(req, res) {
    try {
        const db = await readDB();
        const { nombre, precio, categoria } = req.body;

        // Validaciones
        if (!nombre || precio == null || !categoria) {
            return res.status(400).json({ error: "nombre, precio y categoria son requeridos" });
        }
        if (typeof precio !== "number" || precio < 0) {
            return res.status(400).json({ error: "precio debe ser un número positivo" });
        }

        const nuevo = {
            id: Date.now(),
            nombre,
            precio,
            categoria,
            disponible: true,
            creadoEn: new Date().toISOString()
        };

        db.productos.push(nuevo);
        await writeDB(db);

        return res.status(201).json(nuevo);
    } catch (error) {
        console.error("Error en createProducto:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Actualizar producto
export async function updateProducto(req, res) {
    try {
        const db = await readDB();
        const producto = db.productos.find(p => p.id == req.params.id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const { nombre, precio, categoria, disponible } = req.body;

        if (precio != null && (typeof precio !== "number" || precio < 0)) {
            return res.status(400).json({ error: "precio debe ser un número positivo" });
        }

        if (nombre !== undefined) producto.nombre = nombre;
        if (precio !== undefined) producto.precio = precio;
        if (categoria !== undefined) producto.categoria = categoria;
        if (disponible !== undefined) producto.disponible = disponible;
        producto.actualizadoEn = new Date().toISOString();

        await writeDB(db);

        return res.status(200).json(producto);
    } catch (error) {
        console.error("Error en updateProducto:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 📌 Eliminar producto
export async function deleteProducto(req, res) {
    try {
        const db = await readDB();
        const index = db.productos.findIndex(p => p.id == req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const eliminado = db.productos.splice(index, 1)[0];
        await writeDB(db);

        return res.status(200).json({ message: "Producto eliminado", producto: eliminado });
    } catch (error) {
        console.error("Error en deleteProducto:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}