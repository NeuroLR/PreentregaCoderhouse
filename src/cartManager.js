import fs from "fs";

export class CartModal {
    constructor(productId, quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }
}

export class CartManager {
    constructor(path) {
        this.path = path
        this.fs = fs;
        this.carts = [];
        this.id = 1;
        this.exist = this.fs.existsSync(this.path);
        if (this.exist) {
            const infoObtenida = this.fs.readFileSync(this.path, "utf-8");
            const cartsToObj = JSON.parse(infoObtenida);
            for (let i = 0; i < cartsToObj.length; i++) {
            const newObj = Object.assign(new CartModal, cartsToObj[i]);
            this.carts.push(newObj);
        }
        this.id = this.carts[this.carts.length - 1].id + 1;
        }
    }
    createCart() {
        const newCart = {
            id : this.id,
            products: []
        }
        this.carts.push(newCart);
        this.guardarEnDB();
    }

    obtenerCartByID(cid) {
        const id = parseInt(cid);
        const busquedaEnDB = this.fs.readFileSync(this.path, "utf-8");
        const cart = JSON.parse(busquedaEnDB).find(cart => cart.id == id);
        return cart;
    }

    añadirProducto(cid, producto) {
        const id = parseInt(cid)
        const item = this.carts.find(cart => cart.id == id);
        if (item == undefined) {
            return 401;
        }
        let existe = false;
        for(elemento of item.products) {
            if(elemento.id == producto.id) {
                elemento.quantity++;
                existe = true;
                break;
            }
        }
        if(!existe) item.products.push(producto);
        this.guardarEnDB();
        return 200;
    }

    guardarEnDB() {
        if(this.exist) {
            this.fs.unlinkSync(this.path);
        }
        this.fs.writeFileSync(this.path, JSON.stringify(this.carts), (error) => {
            if(error) {
                console.error(error);
                this.carts.pop();
                return 500;
            }
            this.exist = true;
            this.id++;
        })
    }
}