import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || 'grabGo';

export function verifyToken(req, res, next) {
    // Aceptar token por cookie o por header Authorization: Bearer <token>
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        // Guardamos el token raw para reusarlo en llamadas a otros servicios
        req.token = token;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
}