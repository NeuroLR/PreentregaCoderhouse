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
        const {limit, page, query, sort} = req.query;

        console.log(limit, page, query, sort)

        const products = pm.getProductsDB(limit, page, query, sort);

        // const productsToObj = JSON.parse(products);

        products.then(value => {
            value.status = "success";
            console.log(value)
            
            res.render("home", {
                dbResult: [value],
                style: "home.css"
            })
        }).catch(error => {
            value.status = error

            res.render("home", {
                dbResult: [value],
                style: "home.css"
            })
        }) 

       
    })
}