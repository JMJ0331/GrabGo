const GATEWAY = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {

    const btnCrear      = document.getElementById('btnCrear');
    const btnEliminar   = document.getElementById("btnEliminar");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnFiltrar    = document.getElementById("btnFiltrar");
    const btnRefrescar  = document.getElementById("btnRefrescar");

    const modal       = document.getElementById('modalOrden');
    const modalFiltro = document.getElementById('modalFiltro');

    const btnRegistrar    = document.getElementById('btnRegistrar');
    const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');

    const grid        = document.getElementById("gridOrdenes");
    const estadoVacio = document.getElementById("estadoVacio");

    const inputCliente = document.getElementById('inputCliente');
    const inputPedido  = document.getElementById('inputPedido');
    const inputPago    = document.getElementById('inputPago');
    const inputEstado  = document.getElementById('inputEstado');
    const filtroEstado = document.getElementById('filtroEstado');

    let modoEliminar   = false;
    let modoActualizar = false;
    let cardSeleccionada = null;
    let ordenSeleccionadaId = null;

    // ─── Helpers ────────────────────────────────────────────────

    function verificarEstado() {
        if (grid.children.length === 0) {
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

    function crearCardOrden(orden) {
        const card = document.createElement("div");
        card.classList.add("card", "border-naranja");
        card.dataset.id     = orden.id;
        card.dataset.estado = orden.estado;

        card.innerHTML = `
            <p class="label">Cliente</p>
            <p class="valor-nombre">${orden.items?.[0]?.nombre ?? 'Sin detalle'}</p>
            <p class="label">Estado</p>
            <p class="valor-estado">${orden.estado}</p>
            <p class="label">Total</p>
            <p class="valor-pedido">RD$ ${orden.total}</p>
        `;
        return card;
    }

    // ─── Cargar órdenes desde el backend al iniciar ──────────────

    async function cargarOrdenes() {
        try {
            const response = await fetch(`${GATEWAY}/api/orders`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('No autorizado');
            const ordenes = await response.json();
            grid.innerHTML = "";
            ordenes.forEach(orden => grid.appendChild(crearCardOrden(orden)));
            verificarEstado();
        } catch (error) {
            console.error("Error cargando órdenes:", error);
            verificarEstado();
        }
    }

    await cargarOrdenes();

    // ─── Botón Crear ─────────────────────────────────────────────

    btnCrear.addEventListener("click", () => {
        resetModos();
        cardSeleccionada = null;
        ordenSeleccionadaId = null;
        inputCliente.value = "";
        inputPedido.value  = "";
        inputPago.selectedIndex  = 0;
        inputEstado.selectedIndex = 0;
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

    // ─── Botón Refrescar ─────────────────────────────────────────

    if (btnRefrescar) {
        btnRefrescar.addEventListener("click", cargarOrdenes);
    }

    // ─── Click en cards ──────────────────────────────────────────

    grid.addEventListener("click", async (e) => {
        const card = e.target.closest(".card");
        if (!card) return;

        if (modoEliminar) {
            // Las órdenes no se eliminan en el backend (solo se cancelan)
            // Actualizamos estado a "cancelado"
            const id = card.dataset.id;
            try {
                await fetch(`${GATEWAY}/api/orders/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ estado: 'cancelado' })
                });
                card.remove();
                verificarEstado();
            } catch (error) {
                console.error("Error cancelando orden:", error);
            }
            return;
        }

        if (modoActualizar) {
            cardSeleccionada    = card;
            ordenSeleccionadaId = card.dataset.id;
            inputEstado.value   = card.dataset.estado;
            modal.style.display = "flex";
        }
    });

    // ─── Botón Registrar (crear o actualizar) ────────────────────

    btnRegistrar.addEventListener("click", async () => {
        const cliente = inputCliente.value.trim();
        const pedido  = inputPedido.value.trim();
        const metodo  = inputPago.value;
        const estado  = inputEstado.value;

        if (modoActualizar && cardSeleccionada) {
            // Actualizar estado de orden existente
            try {
                const response = await fetch(`${GATEWAY}/api/orders/${ordenSeleccionadaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ estado })
                });
                const ordenActualizada = await response.json();
                cardSeleccionada.dataset.estado = ordenActualizada.estado;
                cardSeleccionada.querySelector('.valor-estado').textContent = ordenActualizada.estado;
                cardSeleccionada.classList.add("actualizada");
                setTimeout(() => cardSeleccionada.classList.remove("actualizada"), 700);
            } catch (error) {
                console.error("Error actualizando orden:", error);
            }

        } else {
            // Crear nueva orden
            if (!cliente || !pedido) {
                alert("⚠️ Debes completar todos los campos");
                return;
            }

            const nuevaOrden = {
                items: [{ nombre: pedido, precio: 0, cantidad: 1 }],
                metodo,
                estado
            };

            try {
                const response = await fetch(`${GATEWAY}/api/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(nuevaOrden)
                });
                const orden = await response.json();
                grid.appendChild(crearCardOrden(orden));
            } catch (error) {
                console.error("Error creando orden:", error);
            }
        }

        modal.style.display = "none";
        verificarEstado();
    });

    // ─── Aplicar filtro ──────────────────────────────────────────

    btnAplicarFiltro.addEventListener("click", () => {
        const estadoFiltro = filtroEstado.value;
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.style.display = (estadoFiltro === "todos" || card.dataset.estado === estadoFiltro)
                ? "flex" : "none";
        });
        modalFiltro.style.display = "none";
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