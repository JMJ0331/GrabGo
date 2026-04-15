const GATEWAY = 'http://localhost:8080';

const formulario = document.getElementById('loginForm');

formulario.addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuarioInput    = document.getElementById('userName');
    const contrasenaInput = document.getElementById('contrasena');
    const usuario         = usuarioInput.value.trim();
    const contrasena      = contrasenaInput.value.trim();

    const errorUsuario   = document.getElementById('errorUsuario');
    const errorContrasena = document.getElementById('errorContrasena');
    const errorGeneral   = document.getElementById('errorGeneral');

    // Limpiar errores anteriores
    [errorUsuario, errorContrasena, errorGeneral].forEach(e => {
        e.textContent = "";
        e.classList.remove('mostrar');
    });
    [usuarioInput, contrasenaInput].forEach(i => i.classList.remove('input-error', 'vibrar'));

    let valido = true;

    if (usuario === "") {
        errorUsuario.textContent = "El usuario no puede estar vacío";
        errorUsuario.classList.add('mostrar');
        usuarioInput.classList.add('input-error', 'vibrar');
        valido = false;
    }

    if (contrasena === "") {
        errorContrasena.textContent = "La contraseña no puede estar vacía";
        errorContrasena.classList.add('mostrar');
        contrasenaInput.classList.add('input-error', 'vibrar');
        valido = false;
    } else if (contrasena.length < 5) {
        errorContrasena.textContent = "Mínimo 5 caracteres";
        errorContrasena.classList.add('mostrar');
        contrasenaInput.classList.add('input-error', 'vibrar');
        valido = false;
    }

    if (!valido) return;

    try {
        // Llamada al Gateway → AuthService
        const response = await fetch(`${GATEWAY}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // necesario para recibir la cookie JWT
            body: JSON.stringify({ userName: usuario, contrasena })
        });

        const data = await response.json();

        if (response.ok) {
            // Login exitoso → redirigir al inicio
            window.location.href = '/inicio';
        } else {
            errorGeneral.textContent = data.error || 'Error al iniciar sesión';
            errorGeneral.classList.add('mostrar');
        }

    } catch (error) {
        errorGeneral.textContent = 'No se pudo conectar con el servidor';
        errorGeneral.classList.add('mostrar');
    }
});