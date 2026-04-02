import { Router } from "express";
import { registerController, verifyLoginController } from "../controllers/auth.registerController.js";

export const routerAuth = Router();

routerAuth.post('/register', registerController);
routerAuth.post('/login', verifyLoginController);