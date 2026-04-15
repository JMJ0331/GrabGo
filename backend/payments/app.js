import express from "express";
import 'dotenv/config';
import { routerPagos } from "./routes/payments.routes.js";

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de pagos
app.use("/pagos", routerPagos);

// Health check
app.get("/", (req, res) => {
    res.json({ service: "PaymentsService", status: "running" });
});

app.listen(port, () => {
    console.log(`PaymentsService ejecutándose en http://localhost:${port}`);
});