import fs from "fs";
import mongoose from "mongoose";
import CartModel, { CartModal } from "./model/cartModel.js";

export class CartManager {
    constructor(path) {
        this.model = CartModel;

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
        this.guardarEnFS();
    }

    async createCartDB() {
        const result = await this.model.create({
            products: []
        })
        console.log(result);
    }


    obtenerCartByID(cid) {
        const id = parseInt(cid);
        const busquedaEnDB = this.fs.readFileSync(this.path, "utf-8");
        const cart = JSON.parse(busquedaEnDB).find(cart => cart.id == id);
        return cart;
    }

    async obtenerCartByIDMongo(cid) {
        if (typeof cid != "string") {
            return 401;
        }
        try {
            const result = await this.model.findById(cid).exec();
            console.log(result)
            return result;
        } catch (error) {
            console.error(error)
        }
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
        this.guardarEnFS();
        return 200;
    }

    async añadirProductoDB(cid, producto) {
        this.model.findOneAndUpdate(
            {_id: cid},
            {$push: {product: producto}}
        )
    }

    guardarEnFS() {
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
    async deleteProductDB(pid) {
        return await this.model.deleteOne({productId: pid});
    }
}