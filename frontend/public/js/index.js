const formulario = document.getElementById('loginForm');
formulario.addEventListener('submit', function(e) {

    e.preventDefault();

    const usuarioInput = document.getElementById('userName');
    const contrasenaInput = document.getElementById('contrasena');
    const usuario = usuarioInput.value.trim();
    const contrasena = contrasenaInput.value.trim();
    const errorUsuario = document.getElementById('errorUsuario');
    const errorContrasena = document.getElementById('errorContrasena');

    errorUsuario.textContent = "";
    errorContrasena.textContent = "";
    errorContrasena.classList.remove('mostrar');
    usuarioInput.classList.remove('input-error');
    contrasenaInput.classList.remove('input-error');
    
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
     if(valido){
        formulario.submit();
    }
});
