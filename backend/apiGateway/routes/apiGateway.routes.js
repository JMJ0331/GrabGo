import { Router } from "express";
import { authenticateToken } from "../middlewares/jwt.middleware.js";

export const routerGateway = Router();

// URLs de los microservicios (configurables por .env)
const AUTH_URL     = process.env.AUTH_SERVICE_URL     || "http://localhost:3001";
const PRODUCTS_URL = process.env.PRODUCTS_SERVICE_URL || "http://localhost:3004";
const ORDERS_URL   = process.env.ORDERS_SERVICE_URL   || "http://localhost:3002";
const PAYMENTS_URL = process.env.PAYMENTS_SERVICE_URL || "http://localhost:3003";

// Helper: reenvía la petición a un microservicio y devuelve la respuesta
async function proxyRequest(req, res, targetUrl) {
    try {
        const headers = { "Content-Type": "application/json" };

        // Reenviar el token JWT si el usuario está autenticado
        if (req.token) {
            headers["Authorization"] = `Bearer ${req.token}`;
        }

        const options = {
            method: req.method,
            headers
        };

        // Adjuntar body solo en métodos que lo permiten
        if (["POST", "PUT", "PATCH"].includes(req.method)) {
            options.body = JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, options);
        const data = await response.json();

        return res.status(response.status).json(data);

    } catch (error) {
        console.error(`Error en proxy hacia ${targetUrl}:`, error.message);
        return res.status(502).json({ error: "Microservicio no disponible" });
    }
}

// ─────────────────────────────────────────────
// 🔓 AUTH — Rutas públicas (sin token)
// ─────────────────────────────────────────────
routerGateway.post("/auth/register", (req, res) => {
    proxyRequest(req, res, `${AUTH_URL}/auth/register`);
});

routerGateway.post("/auth/login", (req, res) => {
    proxyRequest(req, res, `${AUTH_URL}/auth/login`);
});

// ─────────────────────────────────────────────
// 🔒 PRODUCTOS — GET público, POST/PUT protegidos
// ─────────────────────────────────────────────
routerGateway.get("/productos", (req, res) => {
    proxyRequest(req, res, `${PRODUCTS_URL}/productos`);
});

routerGateway.get("/productos/:id", (req, res) => {
    proxyRequest(req, res, `${PRODUCTS_URL}/productos/${req.params.id}`);
});

routerGateway.post("/productos", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${PRODUCTS_URL}/productos`);
});

routerGateway.put("/productos/:id", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${PRODUCTS_URL}/productos/${req.params.id}`);
});

// ─────────────────────────────────────────────
// 🔒 ORDERS — Todas protegidas
// ─────────────────────────────────────────────
routerGateway.post("/orders", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${ORDERS_URL}/orders`);
});

routerGateway.get("/orders", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${ORDERS_URL}/orders`);
});

routerGateway.get("/orders/:id", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${ORDERS_URL}/orders/${req.params.id}`);
});

routerGateway.put("/orders/:id", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${ORDERS_URL}/orders/${req.params.id}`);
});

// ─────────────────────────────────────────────
// 🔒 PAYMENTS — Todas protegidas
// ─────────────────────────────────────────────
routerGateway.post("/pagos", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${PAYMENTS_URL}/pagos`);
});

routerGateway.get("/pagos", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${PAYMENTS_URL}/pagos`);
});

routerGateway.get("/pagos/:id", authenticateToken, (req, res) => {
    proxyRequest(req, res, `${PAYMENTS_URL}/pagos/${req.params.id}`);
});