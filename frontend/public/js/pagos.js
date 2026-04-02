const GATEWAY = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {

    const listaCarrito  = document.getElementById('listaCarrito');
    const sinProductos  = document.getElementById('sinProductos');
    const totalSpan     = document.getElementById('totalProductos');
    const subTotalEl    = document.getElementById('sub-total');
    const envioEl       = document.getElementById('envio');
    const impuestoEl    = document.getElementById('impuesto');
    const resultadoEl   = document.getElementById('resultado');

    const ENVIO     = 150;
    const IMPUESTO  = 0.18; // 18%

    // ─── Leer carrito desde localStorage ────────────────────────

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    function renderCarrito() {
        listaCarrito.innerHTML = "";

        if (carrito.length === 0) {
            sinProductos.style.display = "flex";
            listaCarrito.style.display = "none";
            totalSpan.textContent = "0";
            subTotalEl.textContent = "0";
            envioEl.textContent    = "0";
            impuestoEl.textContent = "0";
            resultadoEl.textContent = "0";
            return;
        }

        sinProductos.style.display = "none";
        listaCarrito.style.display = "flex";

        let subtotal = 0;

        carrito.forEach((item, index) => {
            subtotal += item.precio * item.cantidad;

            const div = document.createElement('div');
            div.classList.add('producto-item');
            div.innerHTML = `
                <div class="img-placeholder"></div>
                <div class="info">
                    <h3>${item.nombre}</h3>
                    <p>Cantidad: <span class="cantidad">${item.cantidad}</span></p>
                    <p>Precio total: RD$${(item.precio * item.cantidad).toFixed(2)}</p>
                    <div class="acciones">
                        <a href="#" class="btn-eliminar-item" data-index="${index}">Eliminar</a>
                        <span>|</span>
                        <a href="#">Compartir</a>
                    </div>
                </div>
            `;
            listaCarrito.appendChild(div);
        });

        const impuesto = subtotal * IMPUESTO;
        const total    = subtotal + ENVIO + impuesto;

        totalSpan.textContent      = carrito.reduce((acc, i) => acc + i.cantidad, 0);
        subTotalEl.textContent     = subtotal.toFixed(2);
        envioEl.textContent        = ENVIO.toFixed(2);
        impuestoEl.textContent     = impuesto.toFixed(2);
        resultadoEl.textContent    = total.toFixed(2);

        // Guardar total en localStorage para usarlo en TarjetaApp
        localStorage.setItem('totalPago', total.toFixed(2));
    }

    // ─── Eliminar item del carrito ───────────────────────────────

    listaCarrito.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-eliminar-item');
        if (!btn) return;
        e.preventDefault();
        const index = parseInt(btn.dataset.index);
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderCarrito();
    });

    renderCarrito();
});

// ─── Menú hamburguesa ────────────────────────────────────────────

const menuToggle = document.getElementById("menuToggle");
const navMenu    = document.getElementById("navMenu");

if (menuToggle) {
    menuToggle.addEventListener("click", () => navMenu.classList.toggle("active"));
    document.querySelectorAll("#navMenu a").forEach(link => {
        link.addEventListener("click", () => navMenu.classList.remove("active"));
    });
}