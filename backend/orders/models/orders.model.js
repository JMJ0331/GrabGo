import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta anclada al archivo, no al proceso
const dbPath = path.join(__dirname, "../db/ordenesRegistradas.json");

export async function readDB() {
    const data = await readFile(dbPath, "utf-8");
    return JSON.parse(data);
}

export async function writeDB(data) {
    await writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}