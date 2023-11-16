const socket = io();
socket.emit("message", "Hola me comunico desde un web socket");

const btnEnviar = document.getElementById("btn-enviar");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputCode = document.getElementById("code");
const inputPrice = document.getElementById("price");
const inputThumbnail = document.getElementById("thumbnail");
const inputStock = document.getElementById("stock");
const inputCategory = document.getElementById("category");

const btnBorrar = document.getElementById("btn-borrar");
const inputDelete = document.getElementById("inputDeleteProduct");

btnEnviar.addEventListener("click", (e) => {
    e.preventDefault();

    try {
        const title = inputTitle.value
        const description = inputDescription.value
        const code = inputCode.value
        const price = parseInt(inputPrice.value)
        const thumbnail = inputThumbnail.value
        const stock = parseInt(inputStock.value)
        const category = inputCategory.value

        socket.emit("addProduct", title, description, code, price, thumbnail, stock, category);

        inputTitle.value = ""
        inputDescription.value = ""
        inputCode.value = ""
        inputPrice.value = ""
        inputThumbnail.value = ""
        inputStock.value = ""
        inputCategory.value = ""
    }catch(err) {
        console.log(err)
    }
});

const container = document.querySelector(".container");

socket.on("addProduct", data => {
    console.log("se llamo a addProduct")

    try {
        if (data == 401) {
            alert("el codigo ingresado ya existe");
            return
        }

        container.innerHTML += `<div class="product-container">
            <p class="id-${data.id}">${data.id}</p>
            <p>${data.title}</p>
            <p>${data.description}</p>
            <p>${data.code}</p>
            <p>${data.price}</p>
            <p>${data.status}</p>
            <p>${data.thumbnail}</p>
            <p>${data.stock}</p>
            <p>${data.category}</p>
        </div>`
    }catch(e) {
        console.log(e);
    }
})

btnBorrar.addEventListener("click", (e) => {
    e.preventDefault();

    try {
        const pid = parseInt(inputDelete.value);
        socket.emit("deleteProduct", pid)
    } catch(e) {
        console.log(e);
    }
})

socket.on("deleteProduct", result => {

    console.log("se llamo a onDelete")

    if (result == 401) {
        alert("el id debe ser un numero");
        return
    }
    if (result == undefined) {
        alert("no se encontro ningun producto con ese id");
    }
    try {
        const producto = document.querySelector(`.id-${result}`);
        producto.parentElement.remove();
    } catch(e) {
        console.log(e);
    }
})
