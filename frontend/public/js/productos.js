const GATEWAY = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {

    const btnCrear      = document.getElementById('btnCrear');
    const btnEliminar   = document.getElementById("btnEliminar");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnFiltrar    = document.getElementById("btnFiltrar");

    const modal       = document.getElementById('modalOrden');
    const modalFiltro = document.getElementById('modalFiltro');

    const btnRegistrar     = document.getElementById('btnRegistrar');
    const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');

    const grid        = document.getElementById("gridOrdenes");
    const estadoVacio = document.getElementById("estadoVacio");

    const inputProducto   = document.getElementById('inputProducto');
    const inputDescripcion = document.getElementById('inputDescripcion');
    const inputPrecio     = document.getElementById('inputPrecio');
    const inputCategoria  = document.getElementById('inputCategoria');
    const filtroEstado    = document.getElementById('filtroEstado');

    let modoEliminar   = false;
    let modoActualizar = false;
    let cardSeleccionada    = null;
    let productoSeleccionadoId = null;

    // ─── Helpers ────────────────────────────────────────────────

    function verificarEstado() {
        const visibles = [...grid.querySelectorAll('.card')].filter(c => c.style.display !== 'none');
        if (visibles.length === 0) {
            estadoVacio.style.display = "block";
            grid.style.display = "none";
        } else {
            estadoVacio.style.display = "none";
            grid.style.display = "grid";
        }
    }

    function resetModos() {
        modoEliminar = false;
        modoActualizar = false;
        document.body.classList.remove("modo-eliminar", "modo-actualizar");
        btnEliminar.innerHTML   = '<i class="ri-delete-bin-line"></i> Eliminar';
        btnActualizar.innerHTML = '<i class="ri-refresh-line"></i> Actualizar';
    }

    function crearCardProducto(producto) {
        const card = document.createElement("div");
        card.classList.add('card');
        card.dataset.categoria = producto.categoria.toLowerCase();
        card.dataset.id        = producto.id;

        card.innerHTML = `
            <div class="container-image">
                <img src="../images/productos/download-removebg-preview.png" alt="${producto.nombre}">
            </div>
            <div class="container-info">
                <h2 class="nombre-producto">${producto.nombre}</h2>
                <p class="categoria-producto">Categoría: <span class="categoria">${producto.categoria}</span></p>
                <p class="precio">Precio (RD$): <span class="costo">${producto.precio}</span></p>
                <button class="btn-carrito">
                    <img src="../images/productos/cart-arrow-down-svgrepo-com (1).svg" alt="Cart" class="btn-img">
                    Añadir al carrito
                </button>
            </div>
        `;
        return card;
    }

    // ─── Añadir al carrito ───────────────────────────────────────

    grid.addEventListener("click", async (e) => {
        const card = e.target.closest(".card");
        if (!card) return;

        if (modoEliminar) {
            const id = card.dataset.id;
            if (id) {
                // Marcar como no disponible en el backend
                try {
                    await fetch(`${GATEWAY}/api/productos/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ disponible: false })
                    });
                } catch (error) {
                    console.error("Error desactivando producto:", error);
                }
            }
            card.remove();
            verificarEstado();
            return;
        }

        if (modoActualizar) {
            cardSeleccionada       = card;
            productoSeleccionadoId = card.dataset.id;
            inputProducto.value    = card.querySelector(".nombre-producto").textContent;
            inputPrecio.value      = card.querySelector(".costo").textContent;
            inputCategoria.value   = card.dataset.categoria;
            modal.style.display    = "flex";
            return;
        }

        // Añadir al carrito (localStorage)
        if (e.target.closest(".btn-carrito")) {
            const nombre = card.querySelector(".nombre-producto").textContent;
            const precio = parseFloat(card.querySelector(".costo").textContent);
            const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
            const existente = carrito.find(i => i.nombre === nombre);
            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({ nombre, precio, cantidad: 1 });
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            alert(`✅ "${nombre}" añadido al carrito`);
        }
    });

    // ─── Botón Crear ─────────────────────────────────────────────

    btnCrear.addEventListener("click", () => {
        resetModos();
        cardSeleccionada = null;
        productoSeleccionadoId = null;
        inputProducto.value    = "";
        inputDescripcion.value = "";
        inputPrecio.value      = "";
        inputCategoria.selectedIndex = 0;
        modal.style.display = "flex";
    });

    // ─── Botón Eliminar ──────────────────────────────────────────

    btnEliminar.addEventListener("click", () => {
        modoEliminar = !modoEliminar;
        modoActualizar = false;
        document.body.classList.toggle("modo-eliminar");
        document.body.classList.remove("modo-actualizar");
        btnEliminar.innerHTML   = modoEliminar ? '<i class="ri-close-line"></i> Cancelar' : '<i class="ri-delete-bin-line"></i> Eliminar';
        btnActualizar.innerHTML = '<i class="ri-refresh-line"></i> Actualizar';
    });

    // ─── Botón Actualizar ────────────────────────────────────────

    btnActualizar.addEventListener("click", () => {
        modoActualizar = !modoActualizar;
        modoEliminar = false;
        document.body.classList.toggle("modo-actualizar");
        document.body.classList.remove("modo-eliminar");
        btnActualizar.innerHTML = modoActualizar ? '<i class="ri-close-line"></i> Cancelar' : '<i class="ri-refresh-line"></i> Actualizar';
        btnEliminar.innerHTML   = '<i class="ri-delete-bin-line"></i> Eliminar';
    });

    // ─── Botón Filtrar ───────────────────────────────────────────

    btnFiltrar.addEventListener("click", () => {
        modalFiltro.style.display = "flex";
    });

    // ─── Botón Registrar (crear o actualizar) ────────────────────

    btnRegistrar.addEventListener("click", async () => {
        const producto    = inputProducto.value.trim();
        const descripcion = inputDescripcion.value.trim();
        // precio convertido a número — backend valida typeof number
        const precio    = parseFloat(inputPrecio.value);
        const categoria = inputCategoria.value;

        if (!producto || !descripcion || isNaN(precio) || precio <= 0) {
            alert("⚠️ Debes completar todos los campos correctamente");
            return;
        }

        if (modoActualizar && cardSeleccionada) {
            // Actualizar producto en el backend
            try {
                const response = await fetch(`${GATEWAY}/api/productos/${productoSeleccionadoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ nombre: producto, precio, categoria })
                });
                const productoActualizado = await response.json();

                cardSeleccionada.querySelector(".nombre-producto").textContent = productoActualizado.nombre;
                cardSeleccionada.querySelector(".costo").textContent            = productoActualizado.precio;
                cardSeleccionada.querySelector(".categoria").textContent        = productoActualizado.categoria;
                cardSeleccionada.dataset.categoria = productoActualizado.categoria.toLowerCase();

                cardSeleccionada.classList.add("actualizada");
                setTimeout(() => cardSeleccionada.classList.remove("actualizada"), 700);

            } catch (error) {
                console.error("Error actualizando producto:", error);
            }

        } else {
            // Crear nuevo producto en el backend
            try {
                const response = await fetch(`${GATEWAY}/api/productos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ nombre: producto, precio, categoria })
                });
                const nuevoProducto = await response.json();
                grid.appendChild(crearCardProducto(nuevoProducto));
            } catch (error) {
                console.error("Error creando producto:", error);
            }
        }

        modal.style.display = "none";
        verificarEstado();
    });

    // ─── Aplicar filtro ──────────────────────────────────────────

    btnAplicarFiltro.addEventListener("click", () => {
        const categoria = filtroEstado.value;
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.style.display = (categoria === "todos" || card.dataset.categoria === categoria)
                ? "grid" : "none";
        });
        modalFiltro.style.display = "none";
        verificarEstado();
    });

    // ─── Cerrar modales al click fuera ───────────────────────────

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
        if (e.target === modalFiltro) modalFiltro.style.display = "none";
    });

    verificarEstado();
});

// ─── Menú hamburguesa ────────────────────────────────────────────

const menuToggle = document.getElementById("menuToggle");
const navMenu    = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => navMenu.classList.toggle("active"));

document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("active"));
});