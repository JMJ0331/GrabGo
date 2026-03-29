import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import fs from 'node:fs';
import config from "dotenv/config";
import jwt from "jsonwebtoken";
import db from './src/db/metodoPagosRegistrados.json' with { type: 'json' };
import { paymentsModel } from './models/payments.model.js';

config;
const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/src')));
app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.get('/', (req, res) => {
    res.send('Payments');
});

app.post('/registro', paymentsModel);

app.listen(port, () => {
    console.log(`Payments esta ejecutandose... http://localhost:${port}`);
});
