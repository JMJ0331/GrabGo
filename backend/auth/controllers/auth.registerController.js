import { readDB, writeDB } from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || 'grabGo';

export async function verifyLoginController(req, res) {
    try {
        const dbAuth = await readDB();
        const { userName, contrasena } = req.body;

        if (!userName || !contrasena) {
            return res.status(400).json({ error: 'userName y contrasena son requeridos' });
        }

        const usuarioEncontrado = dbAuth.customers.find(
            c => c.nombre.split(' ')[0] === userName
        );

        if (!usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const claveCorrecta = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);

        if (!claveCorrecta) {
            return res.status(401).json({ error: 'Clave incorrecta' });
        }

        const payload = {
            id: usuarioEncontrado.id,
            nombre: usuarioEncontrado.nombre,
            correo: usuarioEncontrado.correo
        };

        const token = jwt.sign(payload, SECRET, { expiresIn: '30m' });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({ message: 'Login exitoso', token });

    } catch (error) {
        console.error('Error en verifyLoginController:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function registerController(req, res) {
    try {
        const dbAuth = await readDB();
        const { userName, correo, contrasena } = req.body;

        if (!userName || !correo || !contrasena) {
            return res.status(400).json({ error: 'userName, correo y contrasena son requeridos' });
        }

        // Validar que no exista usuario duplicado
        const usuarioExistente = dbAuth.customers.find(
            c => c.correo === correo || c.nombre === userName
        );

        if (usuarioExistente) {
            return res.status(409).json({ error: 'El usuario o correo ya está registrado' });
        }

        const hashContrasena = await bcrypt.hash(contrasena, 10);

        const newCustomer = {
            id: dbAuth.customers.length
                ? dbAuth.customers[dbAuth.customers.length - 1].id + 1
                : 1,
            nombre: userName,
            correo: correo,
            contrasena: hashContrasena
        };

        dbAuth.customers.push(newCustomer);
        await writeDB(dbAuth);

        return res.status(201).json({ message: 'Usuario registrado exitosamente', id: newCustomer.id });

    } catch (error) {
        console.error('Error en registerController:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}