import { Router } from "express";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
} from "../controllers/orders.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

export const routerOrders = Router();

// Todas las rutas de órdenes requieren autenticación
routerOrders.post("/", verifyToken, createOrder);
routerOrders.get("/", verifyToken, getOrders);
routerOrders.get("/:id", verifyToken, getOrderById);
routerOrders.put("/:id", verifyToken, updateOrderStatus);