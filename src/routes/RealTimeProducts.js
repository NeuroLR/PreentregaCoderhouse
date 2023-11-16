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
    router.get("/", (req, res) => {
        const products = pm.getProducs();

        const productsToObj = JSON.parse(products);

        res.render("realTimeProducts", {
            productos: productsToObj,
            style: "realTimeProducts.css"
        });
    })
}


