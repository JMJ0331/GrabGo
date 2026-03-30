document.addEventListener('DOMContentLoaded', () => {

    
    const btnCrear = document.getElementById('btnCrear');
    const btnEliminar = document.getElementById("btnEliminar");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnFiltrar = document.getElementById("btnFiltrar");

    
    const modal = document.getElementById('modalOrden');
    const modalFiltro = document.getElementById('modalFiltro');

    
    const btnRegistrar = document.getElementById('btnRegistrar');
    const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');

   
    const grid = document.getElementById("gridOrdenes");
    const estadoVacio = document.getElementById("estadoVacio");

   
    const inputCliente = document.getElementById('inputCliente');
    const inputPedido = document.getElementById('inputPedido');
    const inputPago = document.getElementById('inputPago');
    const inputEstado = document.getElementById('inputEstado');

    const filtroEstado = document.getElementById('filtroEstado');

    let modoEliminar = false;
    let modoActualizar = false;
    let cardSeleccionada = null;

  
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

        document.body.classList.remove("modo-eliminar");
        document.body.classList.remove("modo-actualizar");

        btnEliminar.innerHTML = '<i class="ri-delete-bin-line"></i> Eliminar';
        btnActualizar.innerHTML = '<i class="ri-refresh-line"></i> Actualizar';
    }

    
    btnCrear.addEventListener("click", () => {
        resetModos();
        cardSeleccionada = null;

        inputCliente.value = "";
        inputPedido.value = "";
        inputPago.selectedIndex = 0;
        inputEstado.selectedIndex = 0;

        modal.style.display = "flex";
    });

    
    btnEliminar.addEventListener("click", () => {
        modoEliminar = !modoEliminar;
        modoActualizar = false;

        document.body.classList.toggle("modo-eliminar");
        document.body.classList.remove("modo-actualizar");

        btnEliminar.innerHTML = modoEliminar
            ? '<i class="ri-close-line"></i> Cancelar'
            : '<i class="ri-delete-bin-line"></i> Eliminar';

        btnActualizar.innerHTML = '<i class="ri-refresh-line"></i> Actualizar';
    });

    
    btnActualizar.addEventListener("click", () => {
        modoActualizar = !modoActualizar;
        modoEliminar = false;

        document.body.classList.toggle("modo-actualizar");
        document.body.classList.remove("modo-eliminar");

        btnActualizar.innerHTML = modoActualizar
            ? '<i class="ri-close-line"></i> Cancelar'
            : '<i class="ri-refresh-line"></i> Actualizar';

        btnEliminar.innerHTML = '<i class="ri-delete-bin-line"></i> Eliminar';
    });

    
    btnFiltrar.addEventListener("click", () => {
        modalFiltro.style.display = "flex";
    });

   
    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if (!card) return;

        if (modoEliminar) {
            card.remove();
            verificarEstado();
            return;
        }

        if (modoActualizar) {
            cardSeleccionada = card;

            inputCliente.value = card.querySelector(".valor-nombre").textContent;
            inputPedido.value = card.querySelector(".valor-pedido").textContent;
            inputPago.value = card.querySelector(".valor-pago").textContent;
            inputEstado.value = card.dataset.estado;

            modal.style.display = "flex";
        }
    });

    
    btnRegistrar.addEventListener("click", () => {

        const cliente = inputCliente.value.trim();
        const pedido = inputPedido.value.trim();
        const pago = inputPago.value;
        const estado = inputEstado.value;

        // ❗ VALIDACIÓN COMO ANTES
        if (!cliente || !pedido) {
            alert("⚠️ Debes completar todos los campos");
            return;
        }

        if (modoActualizar && cardSeleccionada) {

            cardSeleccionada.querySelector(".valor-nombre").textContent = cliente;
            cardSeleccionada.querySelector(".valor-pedido").textContent = pedido;
            cardSeleccionada.querySelector(".valor-pago").textContent = pago;
            cardSeleccionada.querySelector(".valor-estado").textContent = estado;

            cardSeleccionada.dataset.estado = estado;

            // 🔥 ANIMACIÓN
            cardSeleccionada.classList.add("actualizada");
            setTimeout(() => {
                cardSeleccionada.classList.remove("actualizada");
            }, 700);

        } else {

            const nuevaCard = document.createElement("div");

            const colores = {
                pendiente: "border-rojo",
                proceso: "border-naranja",
                entregado: "border-verde"
            };

            nuevaCard.className = `card ${colores[estado]}`;
            nuevaCard.dataset.estado = estado;

            nuevaCard.innerHTML = `
                <p class="label">Cliente</p>
                <p class="valor-nombre">${cliente}</p>

                <p class="label">Pedido</p>
                <p class="valor-pedido">${pedido}</p>

                <p class="label">Pago</p>
                <p class="valor-pago">${pago}</p>

                <p class="label">Estado</p>
                <p class="valor-estado">${estado}</p>
            `;

            grid.appendChild(nuevaCard);
        }

        modal.style.display = "none";
        verificarEstado();
    });

    
    btnAplicarFiltro.addEventListener("click", () => {
        const estado = filtroEstado.value;
        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            if (estado === "todos") {
                card.style.display = "block";
            } else {
                card.style.display =
                    card.dataset.estado === estado ? "block" : "none";
            }
        });

        modalFiltro.style.display = "none";
    });

   
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
        if (e.target === modalFiltro) modalFiltro.style.display = "none";
    });

    verificarEstado();
});

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// Cerrar al hacer click en opción
document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});