import express from "express";
import { ProductManager } from "../productManager.js";
import __dirname from "../utils.js";

const router = express.Router();

const pm = new ProductManager("./src/productos.json");

export class HomeRouter {
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

        res.render("home", {
            productos: productsToObj,
            style: "home.css"
        });
    })
}