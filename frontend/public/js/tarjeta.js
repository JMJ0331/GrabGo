const GATEWAY = 'http://localhost:8080';

// ─── Formateo del número de tarjeta ──────────────────────────────

const inputNumeracion = document.querySelector('#numeracion');

inputNumeracion.addEventListener('input', (tecla) => {
    let valor = tecla.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let valorFormateado = '';

    for (let i = 0; i < valor.length; i++) {
        if (i > 0 && i % 4 === 0) valorFormateado += ' ';
        valorFormateado += valor[i];
    }

    tecla.target.value = valorFormateado;
});

// ─── Submit del formulario → llamada al PaymentsService ──────────

const tarjetaForm = document.getElementById('tarjetaForm');

tarjetaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorGeneral = document.getElementById('errorGeneral');
    errorGeneral.textContent = "";
    errorGeneral.classList.remove('mostrar');

    // Recuperar el carrito del localStorage para armar la orden
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    if (carrito.length === 0) {
        errorGeneral.textContent = "Tu carrito está vacío";
        errorGeneral.classList.add('mostrar');
        return;
    }

    try {
        // 1. Crear la orden en OrdersService
        const ordenResponse = await fetch(`${GATEWAY}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ items: carrito })
        });

        if (!ordenResponse.ok) throw new Error('Error creando la orden');
        const orden = await ordenResponse.json();

        // 2. Procesar el pago en PaymentsService
        const pagoResponse = await fetch(`${GATEWAY}/api/pagos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                orderId: orden.id,
                metodo: 'tarjeta'
            })
        });

        if (!pagoResponse.ok) throw new Error('Error procesando el pago');

        // 3. Limpiar carrito y redirigir
        localStorage.removeItem('carrito');
        localStorage.removeItem('totalPago');

        alert('✅ ¡Gracias por tu compra! Tu orden fue procesada exitosamente.');
        window.location.href = '../html/OrdenesApp.html';

    } catch (error) {
        console.error("Error en el pago:", error);
        errorGeneral.textContent = 'Error al procesar el pago. Intenta de nuevo.';
        errorGeneral.classList.add('mostrar');
    }
});