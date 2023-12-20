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
    async createCartDB() {
        return await this.model.create({
            products: []
        })
    }
    async obtenerCartByIDMongo(cid) {
        if (typeof cid != "string") {
            return 401;
        }
        return await this.model.findById(cid).exec();
    }
    async añadirProductoDB(cid, producto) {
        return await this.model.findOneAndUpdate(
            {_id: cid},
            {$push: {products: producto}}
        )
    }
    async deleteProductDB(cid, pid) {
        return await this.model.findOneAndUpdate(
            { _id: cid},
            {$pull: {products: {productId: pid}}}
        )
    }
    async deleteAllProducts(cid) {
        return await this.model.findOneAndUpdate(
            { _id: cid},
            { products: []}
        )
    }
    async updateProductQuantity(cid, pid, quantity) {
        return await this.model.updateOne(
            { 
                _id: cid,
                "products.productId": pid
            },
            { $set: {"products.$.quantity": quantity}}
        )
    }

    // createCart() {
    //     const newCart = {
    //         id : this.id,
    //         products: []
    //     }
    //     this.carts.push(newCart);
    //     this.guardarEnFS();
    // }
    // obtenerCartByID(cid) {
    //     const id = parseInt(cid);
    //     const busquedaEnDB = this.fs.readFileSync(this.path, "utf-8");
    //     const cart = JSON.parse(busquedaEnDB).find(cart => cart.id == id);
    //     return cart;
    // }
    // añadirProducto(cid, producto) {
    //     const id = parseInt(cid)
    //     const item = this.carts.find(cart => cart.id == id);
    //     if (item == undefined) {
    //         return 401;
    //     }
    //     let existe = false;
    //     for(elemento of item.products) {
    //         if(elemento.id == producto.id) {
    //             elemento.quantity++;
    //             existe = true;
    //             break;
    //         }
    //     }
    //     if(!existe) item.products.push(producto);
    //     this.guardarEnFS();
    //     return 200;
    // }
    // guardarEnFS() {
    //     if(this.exist) {
    //         this.fs.unlinkSync(this.path);
    //     }
    //     this.fs.writeFileSync(this.path, JSON.stringify(this.carts), (error) => {
    //         if(error) {
    //             console.error(error);
    //             this.carts.pop();
    //             return 500;
    //         }
    //         this.exist = true;
    //         this.id++;
    //     })
    // }
}