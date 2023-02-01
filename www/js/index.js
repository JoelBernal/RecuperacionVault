//URL del backend
const backendURL = 'http://localhost:3000/'
var categoriaSeleccionada = null;
//Funcion Ootener categorias
async function obtenerCategorias() {
    //Peticion para obtener categorias en el backend
    let res = await fetch(backendURL + 'categories')
    //Convierto los datos de las categorias a json
    let categorias = await res.json()
    let container_categories = document.getElementById('categorycontainer')
    container_categories.innerHTML = ""
    //Obtengo cada categoria
    categorias.forEach(element => {
        //Creo un div para cada categoria
        let divCategory = document.createElement("div");
        divCategory.classList.add("category");
        //Añado un dato personalizado para la categoria con la id de esta
        divCategory.dataset.categoryid = element.id;
        //Creo un div para el titulo de la categoria
        let title_category = document.createElement("div");
        title_category.classList.add("categorytitle");
        title_category.innerHTML = element.name;

        //Creo evento para cambiar de categoria y mostrar sus respectivos sitios
        title_category.addEventListener("click", async () => {
            seleccionarCategoria(divCategory.dataset.categoryid);
            //Creo una variable global con la ID de la categoria seleccionada para poder acceder a ella posteriormente
            window.currentCategory = divCategory.dataset.categoryid;
        });
        divCategory.appendChild(title_category);

        //Creo un elemento para poder eliminar la categoria
        let deleteCategory = document.createElement("i");
        deleteCategory.classList.add("bi", "bi-dash")
        //Creo evento de click para poder borrar la categoria
        deleteCategory.addEventListener("click", () => {
            eliminarCategoria(element.id)
        })
        divCategory.appendChild(deleteCategory);

        container_categories.appendChild(divCategory);
    });

}

//Esperar a que cargen los elementos DOM para ejecutar la funcion
document.addEventListener('DOMContentLoaded', () => {
    obtenerCategorias()
})

//Funcion para seleccionar la categoria
function seleccionarCategoria(id) {
    mostrarSitios(id)
    categoriaSeleccionada = id
    let container_categories = document.getElementById('categorycontainer')

    container_categories.querySelectorAll("div.category").forEach(cat => {
        cat.style.backgroundColor = "transparent"

        //La categoria seleccionada se pone en color mas oscuro
        if (cat.dataset.categoryid == id) {
            cat.style.backgroundColor = "#00000044";
        }
    })
}

//Funcion para mostrar los sitios que contienen las categorias
async function mostrarSitios(id) {
    let res = await fetch(backendURL + 'categories/' + id)
    let sitios = await res.json();
    let table = document.getElementById('categorytable')
    table.innerHTML = ""
    //Se muestra cada uno de los sitios
    sitios.forEach(async site => {
        var createdAtDate = new Date(site.createdAt);
        //Se crea la tabla de los sitios de las categorias mediante html indexado
        let fila = document.createElement('tr')
        fila.dataset.siteid = site.id
        fila.innerHTML =
            `<td class="tablecolumn">${site.name}</td>
            <td class="tablecolumn">${site.user}</td>
            <td class="tablecolumn" style="cursor:pointer" id="contraseña-${site.id}">********</td>
            <td class="tablecolumn">${createdAtDate.getDate()}/${createdAtDate.getMonth()}/${createdAtDate.getFullYear()}</td>
            <td class="tablecolumn tableicons">
                <i class="bi bi-archive-fill" onclick="window.open('${site.url}', '_blank')"></i>
                <i class="bi bi-x-circle-fill" id="borrarSitio-${site.id}"></i>
                <i class="bi bi-pencil-fill" id="editarSitio-${site.id}"></i>
            </td>`


        table.appendChild(fila)
        //Seleccionamos la funcion de borrar sitio y se la añadimos al boton de borrar esta misma con su id correspondiente
        document.getElementById("borrarSitio-" + site.id).addEventListener("click", () => eliminarSitio(site.id))

        //Variable para añadir la contraseña de los diferentes sitios
        let contraseña = document.getElementById("contraseña-" + site.id)
        //Evento para ocultar o no la contraseña haciendo click
        contraseña.addEventListener("click", () => {
            console.log("hola")
            if (contraseña.innerHTML == "********") {
                contraseña.innerHTML = site.password
            } else {
                contraseña.innerHTML = "********"
            }
        })
        //Añadimos la funcion de irPaginaSite al boton de editar un sitio, con sus respectivos parametros en la URL
        document.getElementById('editarSitio-'+site.id).addEventListener("click", ()=> {
            irPaginaSite(site.name, site.user, site.password, site.url, site.description, site.id)
        })
    })
}

//Funcion para eliminar el sitio
async function eliminarSitio(id) {
    //Recuperamos los datos de los sitios con su id y le añadimos el metodo DELETE
    await fetch(backendURL + 'sites/' + id, {
        method: 'DELETE'
    }).then(() => {
        //Cambiamos a null la categoria seleccionada
        mostrarSitios(categoriaSeleccionada)
        seleccionarCategoria(null)
    })
}

//Funcion para eliminar la categoria
async function eliminarCategoria(id) {
    await fetch(backendURL + 'categories/' + id, {
        method: 'DELETE'
    }).then(() => {
        //Con esta funcion hacemos que se refresquen las categorias y mostramos las que hay en ese momento
        obtenerCategorias()
    })
}

//Funcion para añadir categorias
async function añadirCategoria() {
    let categoria = prompt("Añadir Categoria:")
    if (categoria != null) {
        await fetch(backendURL + 'categories', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: categoria
            })
        }).then(() => {
            obtenerCategorias()
        })

    }

}

//Funcion para ir a la pagina del formulario del site
function irPaginaSite(nombreSitio, nombreUsuario, contraseña, urlSitio, descripcion, idSitio) {
    //Guardamos en una variable la url a la que queremos acceder
    let url = "http://localhost:8080/form.html"
    //Concatenamos a la url anterior la categoria de la id para acceder a poder añadir etc... sitios en esa categoria en concreto
    url += "?catId=" + categoriaSeleccionada
    if (nombreSitio) {
        url += `&nombreSitio=${nombreSitio}&nombreUsuario=${nombreUsuario}&contraseña=${contraseña}&urlSitio=${urlSitio}&descripcion=${descripcion}&idSitio=${idSitio}`
    }
    if (categoriaSeleccionada) {
        location.href = url
    }

}

//Evento para ir a la pagina del formulario del site a la hora de hacer click en el boton de crear Sitios
document.getElementById('createsite').addEventListener("click", () => irPaginaSite())

//Evento para acceder a la funcion de añadirCategoria a la hora de darle al boton de crearCategoria.
document.getElementById('createcategory').addEventListener("click", () => añadirCategoria())


