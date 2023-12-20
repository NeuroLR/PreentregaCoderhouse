import express from "express";
import { CartManager } from "../cartManager.js";
import { ProductManager } from "../productManager.js";

const router = express.Router();

const cm = new CartManager("./src/carrito.json");

const pm = new ProductManager("./src/productos.json");

export class CartRouter {
    constructor() {
        addGetMethods();
        addPostMethods();
        addDeleteMethods();
        addPutMethods();
    }

    getRouter() {
        return router;
    }
}

function addGetMethods() {
    router.get("/:cid", (req, res) => {
        const id = req.params.cid
        const result = cm.obtenerCartByIDMongo(id);
        if (result == undefined) {
            return res.status(401).send("No existe un carrito con ese id");
        }
        result.then(value => {
            if (value == undefined || value == null) {
                return res.status(404).json({
                    code: 404,
                    message: "no hay ningun carrito con ese id",
                    carrito: null
                })
            }
            res.status(200).json({
                code: 200,
                message: "se encontro un carrito",
                carrito: value
            })
        })
    })
}

function addPutMethods() {
    router.put("/:cid", async (req, res) => {
        const cid = req.params.cid;
        const {productId, quantity} = req.body;


        try {
            const producto = await pm.getProductByIdDB(productId);

            if (producto == null || producto == undefined) {
                return res.status(400).json({
                    code: 400,
                    message: "no se encontro un producto con ese id",
                    result: null
                })
            }

            const result = await cm.añadirProductoDB(cid, {productId, quantity});

            res.status(200).json({
                code: 200,
                message: "producto añadido con exito",
                producto: result
            })
        } catch(err) {
            return res.status(404).json({
                code: 404,
                message: "no se pudo guardar el producto",
                result: null
            })
        }
    })

    router.put("/:cid/products/:pid", async (req, res) => {
        const {cid, pid} = req.params;
        const quantity = parseInt(req.body.quantity);

        if (quantity == NaN) {
            return res.status(404).json({
                code: 404,
                message: "la propiedad quantity debe ser un valor numerico"
            })
        }

        try {
            const result = await cm.updateProductQuantity(cid, pid, quantity);
            return res.status(200).json({
                code: 200,
                message: "producto actualizado correctamente",
                result: result
            })
        }catch(err) {
            return res.status(400).json({
                code: 400,
                message: "ocurrio un error actualizando el producto",
                error: err
            })
        }
    })
}

function addDeleteMethods() {
    router.delete("/:cid/products/:pid", async (req, res) => {
        const {cid, pid} = req.params;
        try {
            const result = await cm.deleteProductDB(cid, pid);
            return res.status(200).json({
                code: 200,
                message: "producto eliminado correctamente",
                result: result
            })
        }catch(err) {
            return res.status(400).json({
                code: 400,
                message: "ocurrio un error eliminando el producto",
                error: err
            })
        }
    })

    router.delete("/:cid", async (req, res) => {
        const cid = req.params.cid;
        try {
            const result = await cm.deleteAllProducts(cid);
            return res.status(200).json({
                code: 200,
                message: "productos eliminados correctamente",
                result: result
            })
        }catch(err) {
            return res.status(400).json({
                code: 400,
                message: "ocurrio un error eliminando los productos",
                error: err
            })
        }
    })
}

function addPostMethods() {
    router.post("/", (req, res) => {
        const result = cm.createCartDB();
        result.then(value => {
            if (!value) {
                return res.status(404).json({
                    code: 404,
                    message: "no se pudo crear el carrito",
                    result: null
                })
            }
            res.status(200).json({
                code: 200,
                message: "carrito creado con exito",
                result: value
            })
        })
    })

    router.post("/:cid/product/:pid", (req, res) => {
        const cid = req.params.cid
        const pid = req.params.pid

        const productExist = pm.getProductByIdDB(pid);

        productExist.then(value => {
            res.json({
                message: "producto encontrado!",
                resultado: value
            })
        }).catch(err => {
            res.json({
                message: "no exite un producto con ese id",
                error: err
            })
        })
    })
}