import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import config from "dotenv/config";
import jwt from "jsonwebtoken";
import json from "express";
import { routerAuth } from "../auth/routes/auth.routes.js";
import { authenticateToken } from "./middlewares/jwt.middleware.js"; import cookieParser from 'cookie-parser';

config;
const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.use('/auth', routerAuth);
app.get('/inicio', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/html/ProductosApp.html'));
});

app.listen(port, () => {
    console.log(`apiGateway esta ejecutandose... http://localhost:${port}`);
});