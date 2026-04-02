import { Router } from "express";
import { getProductos, createProducto } from "../controllers/products.controller.js";

export const routerProductos = Router();

routerProductos.get("/", getProductos);
routerProductos.post("/", createProducto);