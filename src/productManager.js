import fs from "fs";

export class ProductModel {
    constructor(title, description, code, price, status = true, thumbnail, stock, category) {
        this.id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.status = status;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
    }
}

export class ProductManager {

    constructor(path) {
        this.path = path;
        this.fs = fs;
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
        const result = this.fs.readFileSync(this.path, "utf-8");
        return result;
    }
    getProductById(productId) {
        if (typeof productId != "number") {
            console.error("¡Se debe ingresar un valor numerico para buscar el producto!");
            return;
        }
        const result = this.fs.readFileSync(this.path, "utf-8");
        const producto = JSON.parse(result).find(product => product.id === productId)
        return producto;
    }
    updateProduct(id, newData) {
        if (typeof id != "number") {
            console.error("el id debe ser un valor numerico");
        }
        const producto = this.producs.findIndex(product => product.id === id);
        if (producto == null || producto == undefined) {
            console.warn("no se encontro un producto con ese id");
            return;
        }
        newData.id = id;
        this.producs[producto] = newData;
        this.actualizarDB();
        console.log(this.producs);
    }
    deleteProduct(id) {
        if (typeof id != "number") {
            console.error("el id debe ser un valor numerico");
        }
        const producto = this.producs.findIndex(product => product.id === id);
        if (producto == -1) {
            console.warn("no se encontro un producto con ese id");
            return undefined;
        }
        const borrado = this.producs.splice(producto, 1);
        this.actualizarDB();
        console.log(this.producs);
        return borrado;
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