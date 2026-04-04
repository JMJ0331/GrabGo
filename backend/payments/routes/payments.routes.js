import { Router } from "express";
import { procesarPago, getPagos, getPagoById } from "../controllers/payments.controller.js";
import { verifyToken } from "../auth.middleware.js";

export const routerPagos = Router();

// Todas las rutas de pagos requieren autenticación
routerPagos.post("/", verifyToken, procesarPago);
routerPagos.get("/", verifyToken, getPagos);
routerPagos.get("/:id", verifyToken, getPagoById);