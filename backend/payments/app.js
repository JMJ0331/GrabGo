import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import fs from 'node:fs';
import config from "dotenv/config";
import jwt from "jsonwebtoken";
import db from './src/db/metodoPagosRegistrados.json' with { type: 'json' };

config;
const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/src')));

app.get('/', (req, res) => {
    res.send('Payments');
});

function prueba() {
    const quesera = {Usuario: "Manuel", Productos: "Manzanas", precio: "$000000"}
    return quesera;
}

app.post('/', (req, res) => {
    const objeto = path.join(__dirname, "./src/db/metodoPagosRegistrados.json")
    const nuevo = {payments: []}
    if (fs.existsSync(objeto)) {
        console.log("Se encontro el archivo")
            const contenido = fs.readFileSync(objeto, "utf-8")
            try {
                const jsonleido = JSON.parse(contenido)
                if (jsonleido && jsonleido.payments) {
                    nuevo.payments = jsonleido.payments
                }
                  } catch (e) {
                console.log("JSON corrupto, reseteando a lista vacía");
            }}
    nuevo.payments.push(prueba())
    fs.writeFileSync('./src/db/metodoPagosRegistrados.json', JSON.stringify(nuevo, null, 2), "utf-8")
    console.log("Archivo guardado con éxito");
    res.send(`Datos recibidos correctamente`);
})

app.listen(port, () => {
    console.log(`Payments esta ejecutandose... http://localhost:${port}`);
});
