const inputNumeracion = document.querySelector('#numeracion');

inputNumeracion.addEventListener('input', (tecla) => {

    let valor = tecla.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let valorFormateado = '';

    for (let i = 0; i < valor.length; i++) {
        if (i > 0 && i % 4 === 0) {
            valorFormateado += ' ';
        }
        valorFormateado += valor[i];

    }

    tecla.target.value = valorFormateado;
});

const input= document.querySelector('#btnEnviar');
input.addEventListener('click', (e) => {
    alert('¡Gracias por tu compra!');
});

