import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || 'grabGo';

export function authenticateToken(req, res, next) {
    // Acepta token por cookie o por header Authorization: Bearer <token>
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }
        req.user = user;
        req.token = token; // Guardamos el token para reenviarlo a los microservicios
        next();
    });
}