import express from "express";
import 'dotenv/config';
import { routerOrders } from "./routes/orders.routes.js";

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de órdenes
app.use("/orders", routerOrders);

// Health check
app.get("/", (req, res) => {
    res.json({ service: "OrdersService", status: "running" });
});

app.listen(port, () => {
    console.log(`OrdersService ejecutándose en http://localhost:${port}`);
});