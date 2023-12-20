import express from "express";
import { ProductManager } from "../productManager.js";

const router = express.Router();
const pm = new ProductManager("./src/productos.json");

export class RealTimeProducts {
    constructor() {
        addGetMethods();
    }
    getRouter() {
        return router;
    }
}

function addGetMethods() {
    router.get("/", async (req, res) => {
        const {limit, page, query, sort} = req.query

        const products = await pm.getProductsDB(limit, page, query, sort);
        
        res.render("realTimeProducts", {
            productos: products.docs,
            style: "realTimeProducts.css"
        });
    })
}


