import express from "express";
import { CartManager } from "../cartManager";
import { ProductManager } from "../productManager";

const router = express.Router();

const cm = new CartManager();

const pm = new ProductManager()

export class CartRouter {
    constructor() {
        addGetMethods();
        addPostMethods();
    }

    getRouter() {
        return router;
    }
}

function addGetMethods() {
    router.get("/:cid", (req, res) => {
        const id = parseInt(req.params.cid);
        const result = cm.obtenerCartByID(id);
        if (result == undefined) {
            return res.status(401).send("No existe un carrito con ese id");
        }
        res.status(200).json({
            code: 200,
            message: "se encontro un carrito",
            carrito: result
        })
    })
}

function addPostMethods() {
    router.post("/:cid/product/:pid", (req, res) => {
        const cid = parseInt(req.params.cid);
        const result = cm.obtenerCartByID(cid);
        if (result == undefined) {
            return res.status(401).send("No existe un carrito con ese id");
        }
        const pid = parseInt(req.params.pid);
        const producto = pm.getProductById(pid);
        const codigo = cm.añadirProducto(cid, producto);
        if (codigo >= 400) {
            return res.status(codigo).send("no se encontro ningun carrito con ese id");
        }
        res.status(codigo).json({
            code: codigo,
            message: "producto agregado con exito"
        })
    })
}