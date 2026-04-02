import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { authenticateToken } from "./src/middlewares/jwt.middleware.js";
import { routerGateway } from "./src/routes/apiGateway.routes.js";

const app = express();
const port = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares globales
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend estático
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Health check
app.get('/', (req, res) => {
    res.json({ service: 'APIGateway', status: 'running' });
});

// Rutas proxy a microservicios (auth no requiere token)
app.use('/api', routerGateway);

// Ruta protegida del frontend
app.get('/inicio', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/html/ProductosApp.html'));
});

app.listen(port, () => {
    console.log(`APIGateway ejecutándose en http://localhost:${port}`);
});