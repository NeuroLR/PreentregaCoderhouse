import express from "express";
import { ProductManager } from "../productManager.js";
import { ProductModel } from "../model/productModel.js";

const router = express.Router();

const pm = new ProductManager("./src/productos.json");
export class ProductRouter  {
    constructor() {
        addGetMethods();
        addPostMethods();
        addPutMethods();
        addDeleteMethods();
    }
    getRouter() {
        return router;
    }
}

function addGetMethods() {
    router.get("/products", async (req, res) => {
        const productos = await pm.getProductsDB();
        console.log(productos);
    
        const limit = parseInt(req.query.limit);

        if(limit < 0) {
            return res.status(400).send("ERROR: El limite no puede ser negativo");
        }
        
        if(limit >= 0) {
            const cut = productos.slice(0, limit);
            return res.status(200).json(cut);
        }else {
            return res.status(200).json(productos);
        }
    });

    router.get("/products/:pid", async (req, res) => {
        try {
            const id = req.params.pid;
            const item = await pm.getProductByIdDB(id);
            console.log(item)
            return res.status(200).json(item);
        } catch(e) {
            console.error("error en productRouter", e);
            return res.status(500).send("no existe un producto con ese id");
        }
    });
}

function addPostMethods() {
    router.post("/products", (req, res) => {
        const {title, description, code, price, status = true, stock, category} = req.body;
        const esValido = (typeof title == "string", typeof description == "string", typeof code == "string",
            typeof price == "number", typeof stock == "number", typeof category == "string");

        if (!esValido) {
            return res.status(404).json({
                code: 404,
                message: "Los datos ingresados son incorrectos",
                items: {
                    titulo: title,
                    description: description,
                    code: code,
                    price: price,
                    status: status,
                    stock: stock,
                    category: category
                }
            });
        }

        const thumbnail = req.body.thumbnail || [];

        if (!Array.isArray(thumbnail)) {
            return res.status(403).json({
                code: 403,
                message: "El elemento thumbnail debe ser un array"
            });
        }
        const result = pm.addProductDB(title,description,code,price,status,thumbnail,stock,category);
        result.then(value => {
            res.status(200).json({
                code: 200,
                message: "Producto agregado con exito",
                item: value
            })
        }).catch(err => {
            res.status(404).json({
                code: 404,
                message: "Hubo un error agregando el producto",
                item: err
            })
        })
    })
}

function addPutMethods() {
    router.put("/products/:pid", async (req, res) => {
        const pid = req.params.pid;
        const newData = req.body;
    
        try {
            const result = await pm.updateProductDB(pid, newData);
            return res.status(200).json({
                code: 200,
                message: "producto actualizado con exito!",
                item: result
            })
        } catch(err) {
            res.status(400).json({
                code: 400,
                message: "error actualizando el producto",
                error: err
            });
        }
    })
}

function addDeleteMethods() {
    router.delete("/products/:pid", async (req, res) => {
        const pid = req.params.pid;

        try {
            const item = await pm.deleteProductDB(pid);
            if (item == undefined || item == null) {
                return res.status(404).send("el producto que se intenta eliminar no existe");
            }
            return res.status(200).json({
                code: 200,
                message: "producto eliminado correctamente",
                deletedItem: item
            })

        } catch(err) {
            res.status(400).json({
                code: 400,
                message: "error borrando el producto, probablemente el producto no existe",
                error: err
            });
        }
    }) 
} 
