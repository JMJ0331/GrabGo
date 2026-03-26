import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import config from "dotenv/config";
import jwt from "jsonwebtoken";
import db from './src/db/usuariosRegistrados.json' with { type: 'json' };

config;
const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/src')));

app.get('/', (req, res) => {
    res.send('apiGateway');
});

app.listen(port, () => {
    console.log(`apiGateway esta ejecutandose... http://localhost:${port}`);
});

console.log(db);