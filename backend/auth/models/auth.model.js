import express from "express";
import usuariosRegistrados from "../src/db/usuariosRegistrados.json" with {type: 'json'};

export function saveData(userName, correo, contrasena) {
    const userData = { userName, correo, contrasena };
    usuariosRegistrados.push(userData);
    return usuariosRegistrados;
}