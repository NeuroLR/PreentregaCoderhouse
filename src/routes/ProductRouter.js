import express from "express";
import { ProductManager } from "../productManager.js";
import { ProductModel } from "../model/productModel.js";


const router = express.Router()

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
    router.get("/products", (req, res) => {
        const productos = pm.getProducs();
    
        const limit = parseInt(req.query.limit);

        if(limit < 0) {
            return res.status(400).send("ERROR: El limite no puede ser negativo");
        }
        
        if(limit >= 0) {
            const productosToObj = JSON.parse(productos);
            const cut = productosToObj.slice(0, limit);
            return res.status(200).json(cut);
        }else {
            return res.status(200).json(JSON.parse(productos));
        }
    });

    router.get("/products/:pid", (req, res) => {
        try {
            const id = parseInt(req.params.pid);
            const item = pm.getProductById(id);
            return res.status(200).json(item);
        } catch(e) {
            console.error("ocurrio un error en el servidor", e);
            return res.status(500).send("ocurrio un error");
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
                message: "Los datos ingresados son incorrectos"
            });
        }

        const thumbnail = req.body.thumbnail || [];

        if (!Array.isArray(thumbnail)) {
            return res.status(403).json({
                code: 403,
                message: "El elemento thumbnail debe ser un array"
            });
        }
        try {
            const producto = new ProductModel(title,description,code,price,status,thumbnail,stock,category)
            pm.addProduct(producto);
            return res.status(200).json({
                code: 200,
                message: "Producto agregado con exito",
                item: producto
            })
        } catch(e) {
            console.error("ocurrio un error añadiendo un producto", e);
            return res.status(500).json({
                code: 500,
                message: "hubo un error en el servidor intentando agregar el producto"
            })
        }
    })
}

function addPutMethods() {
    router.put("/products/:pid", (req, res) => {
        const pid = parseInt(req.params.pid);
        const newData = req.body;
    
        const tempProduct = pm.getProductById(pid);
        if (tempProduct == undefined) {
            return res.status(404).send("El producto no existe");
        }
        
        for (const llave in newData) {
            if (newData[llave] == undefined) continue;
            if (tempProduct[llave] == undefined) continue;
            tempProduct[llave] = newData[llave];
        }

        try {
            pm.updateProduct(pid, tempProduct);
            return res.status(200).json({
                code: 200,
                message: "producto actualizado con exito!",
                item: tempProduct
            })
        } catch(e) {
            res.status(500).send("ocurrio un error intentando actualizar el producto");
        }
    })
}

function addDeleteMethods() {
    router.delete("/products/:pid", (req, res) => {
        const pid = parseInt(req.params.pid);

        try {
            const item = pm.deleteProduct(pid);
            if (item == undefined) {
                return res.status(404).send("el producto que se intenta eliminar no existe");
            }
            return res.status(200).json({
                code: 200,
                message: "producto eliminado correctamente",
                deletedItem: item
            })

        } catch(e) {
            res.status(500).send("ocurrio un error intentando eliminar el producto");
        }
    }) 
} 
