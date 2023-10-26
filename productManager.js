class ProductModel {
    constructor(title, description, price, thumbnail, code, stock) {
        this.id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class Productmanager {

    constructor() {
        this.path = "./database/productos.json";
        this.fs = require("fs");
        this.producs = [];
        this.id = 1;
        this.exist = this.fs.existsSync(this.path);
        if (this.exist) {
            const infoObtenida = this.fs.readFileSync(this.path, "utf-8");
            const productosToObj = JSON.parse(infoObtenida);
            for (let i = 0; i < productosToObj.length; i++) {
            const newObj = Object.assign(new ProductModel, productosToObj[i]);
            this.producs.push(newObj);
        }
        this.id = this.producs[this.producs.length - 1].id + 1;
        }
    }
    addProduct(newProduct) {
        if (!(newProduct instanceof ProductModel)) {
            console.error("Se debe pasar como parametro un objeto de tipo ProductModel");
            return;
        }
        const existeElCodigo = this.producs.find(producto =>producto.code === newProduct.code);
        if (existeElCodigo) {
            console.error("Ya hay un producto con el mismo codigo");
            return;
        }
        newProduct.id = this.id
        this.producs.push(newProduct);
        this.actualizarDB()
        this.id++;
    }
    getProducs() {
        return this.producs;
    }
    getProductById(productId) {
        if (typeof productId != "number") {
            console.error("¡Se debe ingresar un valor numerico para buscar el producto!");
            return;
        }
        const producto = this.producs.find(product => product.id === productId)
        return producto ?? "Product not found";
    }
    updateElement(id, clave, valor) {
        if (typeof id != "number") {
            console.error("el id debe ser un valor numerico");
        }
        const producto = this.producs.findIndex(product => product.id === id);
        if (producto == null || producto == undefined) {
            console.warn("no se encontro un producto con ese id");
            return;
        }
        if (typeof clave == "string") {
            this.producs[producto][clave] = valor;
            this.actualizarDB();
            console.log(this.producs)
        }else {
            console.error("se tiene que pasar una clave con un valor de string");
        }
    }
    updateProduct(id, newObj) {
        if (typeof id != "number") {
            console.error("el id debe ser un valor numerico");
        }
        const producto = this.producs.findIndex(product => product.id === id);
        if (producto == null || producto == undefined) {
            console.warn("no se encontro un producto con ese id");
            return;
        }
        if(newObj instanceof ProductModel) {
            newObj.id = id
            this.producs[producto] = newObj
            this.actualizarDB();
            console.log(this.producs)
        }else {
            console.error("tenes que pasar una instancia de la clase ProductModel");
        }
    }
    deleteProduct(id) {
        if (typeof id != "number") {
            console.error("el id debe ser un valor numerico");
        }
        const producto = this.producs.findIndex(product => product.id === id);
        if (producto == null || producto == undefined) {
            console.warn("no se encontro un producto con ese id");
            return;
        }
        this.producs.splice(producto, 1);
        this.actualizarDB()
        console.log(this.producs)
    }
    actualizarDB() {
        if (this.exist) {
            this.fs.unlinkSync(this.path);
       }
       this.fs.writeFileSync(this.path, JSON.stringify(this.producs), (error) => {
        if (error) {
            console.error(`ocurrio un error almacenando el producto, ${error.message}`);
            this.producs.pop();
            return;
        }
        this.exist = true
    });
    }
}


const pm = new Productmanager();
const product1 = new ProductModel("titulo", "descripcion", 100, "thumbnail", "prueba123", 10);
const product2 = new ProductModel("titulo2", "descripcion2", 100, "thumbnail2", "prueba2", 10);
const product3 = new ProductModel("titulo3", "descripcion3", 300, "thumbnail3", "codigo3", 30);
const product4 = new ProductModel("titulo4", "descripcion4", 400, "thumbnail4", "codigo4", 40);
const productoVacio = new ProductModel();

// pm.addProduct("123");
// pm.addProduct(productoVacio);

pm.addProduct(product1);
pm.addProduct(product2);
pm.addProduct(product3);
pm.addProduct(product4);

const product5 = new ProductModel("titulo5", "descripcion5", 500, "thumbnail5", "codigo5", 50);
pm.updateElement(2, "title", "testeando123");
pm.updateProduct(3, product5);
pm.deleteProduct(1);

// console.log(pm.getProducs());
// console.log(pm.getProductById(10));
// console.log(pm.getProductById(3));