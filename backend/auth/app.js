import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import 'dotenv/config';
import { routerAuth } from './routes/auth.routes.js';

const app = express();
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/src')));

// Rutas de autenticación
app.use('/auth', routerAuth);

// Health check
app.get('/', (req, res) => {
    res.json({ service: 'AuthService', status: 'running' });
});

app.listen(port, () => {
    console.log(`AuthService ejecutándose en http://localhost:${port}`);
});