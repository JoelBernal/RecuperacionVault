const backendURL = 'http://localhost:3000/'

//Funcion para generar una contraseña aleatoria
function generarContraseñaAleatoria(length) {
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var pass = "";
    for (let i = 0; i < length; i++) {
        pass += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return pass;
}

//Evento que al hacer click en el boton se genere una contraseña aleatoria
document.getElementById("passwordgenerator").addEventListener("click", () => {
    document.getElementById("password").value = generarContraseñaAleatoria(16)
})

//Funcion para enviar sitio
async function enviarSitio() {
    //Obtiene parametros de la URL 
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let id = params.catId;
    let idSitio = params.idSitio;

    //Coge los datos de los sitios con sus id respectivas
    await fetch(backendURL + 'sites/' + idSitio, {
        //Mediante el metodo put modificamos el contenido de los sites.
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        //Convertimos los datos del JSON a String para imprimirlos
        body: JSON.stringify({
            name: document.getElementById('sitename').value,
            url: document.getElementById('url').value,
            user: document.getElementById('username').value,
            password: document.getElementById('password').value,
            description: document.getElementById('description').value,
        })
        //.then para que te lleve de vuelta a la pagina principal una vez realizado el sitio
    }).then(() => {
        location.href = "http://localhost:8080/"
    })
}

//Funcion para mostrar los valores del sitio a la hora de darle al boton de editar
function rellenarValores() {
    //Obtiene parametros de la URL y los guarda en una variable
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    /* let { nombreSitio, nombreUsuario, contraseña, url, descripcion } = params  // Obtiene los parámetros de una variable de una forma más corta y sencilla */
    document.getElementById('sitename').value = params.nombreSitio
    document.getElementById('username').value = params.nombreUsuario
    document.getElementById('password').value = params.contraseña
    document.getElementById('url').value = params.urlSitio
    document.getElementById('description').value = params.descripcion

}


//Evento para cargar la funcion rellenarValores() al cargar la pagina
document.addEventListener("DOMContentLoaded", ()=>{
    rellenarValores()
})


//Evento para cuando se envia un formulario
document.addEventListener("submit", (e) => {
    //Funcion para no resetear la pagina
    e.preventDefault()
    enviarSitio()
})
