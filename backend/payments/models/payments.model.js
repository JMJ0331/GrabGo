import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const paymentsModel = (req, res) => {
    const objeto = path.join(__dirname, '..', "src",'db', 'metodoPagosRegistrados.json');
    const { userName , numeracion, nvv} = req.body
    const Datosinput = {Nombre: userName, Numero: numeracion, NVV: nvv}
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
    nuevo.payments.push(Datosinput)
    fs.writeFileSync(objeto, JSON.stringify(nuevo, null, 2), "utf-8")
    console.log("Archivo guardado con éxito");
    res.send(`Datos recibidos correctamente`);
}