import express from "express";
import 'dotenv/config';
import { routerProductos } from "./routes/Products.routes.js";

const app = express();
const port = process.env.PORT || 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de productos
app.use("/productos", routerProductos);

// Health check
app.get("/", (req, res) => {
    res.json({ service: "ProductsService", status: "running" });
});

app.listen(port, () => {
    console.log(`ProductsService ejecutándose en http://localhost:${port}`);
});