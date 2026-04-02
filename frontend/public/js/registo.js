const GATEWAY = 'http://localhost:8080';

const formulario = document.getElementById('registerForm');

formulario.addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuarioInput    = document.getElementById('userName');
    const correoInput     = document.getElementById('correo');
    const contrasenaInput = document.getElementById('contrasena');

    const usuario   = usuarioInput.value.trim();
    const correo    = correoInput.value.trim();
    const contrasena = contrasenaInput.value.trim();

    const errorUsuario   = document.getElementById('errorUsuario');
    const errorCorreo    = document.getElementById('errorCorreo');
    const errorContrasena = document.getElementById('errorContrasena');
    const errorGeneral   = document.getElementById('errorGeneral');

    // Limpiar errores anteriores
    [errorUsuario, errorCorreo, errorContrasena, errorGeneral].forEach(e => {
        e.textContent = "";
        e.classList.remove('mostrar');
    });
    [usuarioInput, correoInput, contrasenaInput].forEach(i => i.classList.remove('input-error', 'vibrar'));

    let valido = true;

    if (usuario === "") {
        errorUsuario.textContent = "El nombre no puede estar vacío";
        errorUsuario.classList.add('mostrar');
        usuarioInput.classList.add('input-error', 'vibrar');
        valido = false;
    }

    if (correo === "") {
        errorCorreo.textContent = "El correo no puede estar vacío";
        errorCorreo.classList.add('mostrar');
        correoInput.classList.add('input-error', 'vibrar');
        valido = false;
    } else if (!correo.includes("@") || !correo.includes(".")) {
        errorCorreo.textContent = "Correo inválido";
        errorCorreo.classList.add('mostrar');
        correoInput.classList.add('input-error', 'vibrar');
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
        const response = await fetch(`${GATEWAY}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: usuario, correo, contrasena })
        });

        const data = await response.json();

        if (response.ok) {
            // Registro exitoso → redirigir al login
            window.location.href = '../index.html';
        } else {
            errorGeneral.textContent = data.error || 'Error al registrar usuario';
            errorGeneral.classList.add('mostrar');
        }

    } catch (error) {
        errorGeneral.textContent = 'No se pudo conectar con el servidor';
        errorGeneral.classList.add('mostrar');
    }
});