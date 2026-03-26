import { Router } from "express";
import { registerController } from "../controllers/auth.registerController.js";
export const routerAuth = Router();

routerAuth.post('/auth/register', registerController);