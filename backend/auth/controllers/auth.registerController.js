import { read } from "fs";
import { readDB, writeDB } from "../models/auth.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "dotenv/config";

config;
const SECRET = process.env.SECRET || 'grabGo';

export async function verifyLoginController(req, res) {
    const dbAuth = await readDB();
    const { userName, contrasena } = req.body;
    const usuarioEncontrado = dbAuth.customers.find(c => c.nombre.split(' ')[0] === userName);
    if (!usuarioEncontrado) {
        res.send('no se encontro usuario');
        return;
    } else {
        const seEncontroUsuario = !!(dbAuth.customers && dbAuth.customers.find(c => c.nombre.split(' ')[0] === userName));
        const usuarioEncontradoClave = usuarioEncontrado.contrasena;
        const claveCorrecta = await bcrypt.compare(contrasena, usuarioEncontradoClave);
        if (seEncontroUsuario && claveCorrecta) {
            const token = jwt.sign({ usuarioEncontrado }, SECRET, { expiresIn: '30m' });
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false
            });
            res.redirect('/inicio');
        } else {
            res.send('Clave incorrecta!');
        }
    }
}

export async function registerController(req, res) {
    const dbAuth = await readDB();
    const { userName, correo, contrasena } = req.body;
    const hashContrasena = await bcrypt.hash(contrasena, 10);
    const newCustomer = {
        id: dbAuth.customers.length ? dbAuth.customers[dbAuth.customers.length - 1].id + 1 : 1,
        nombre: userName,
        correo: correo,
        contrasena: hashContrasena
    };

    dbAuth.customers.push(newCustomer);
    await writeDB(dbAuth);
    res.redirect('/inicio');
}