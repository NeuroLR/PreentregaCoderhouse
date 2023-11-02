import { Productmanager } from "./productManager.js";
import express from 'express';

const pm = new Productmanager("./src/productos.json");

const app = express();

app.use(express.urlencoded({extended:true}));

app.get("/producs/", (req, res) => {
    const productos = pm.getProducs();

    const limit = parseInt(req.query.limit);

    if(limit != NaN) {
        const productosToObj = JSON.parse(productos);
        const cut = productosToObj.slice(0, limit);
        return res.send(cut);
    }else {
        res.send(productos);
    }
});

app.get("/producs/:pid", (req, res) => {
    const id = parseInt(req.params.pid);
    const item = pm.getProductById(id);
    res.send(item);
})

app.listen(8080, () => {
    console.log("¡Se levanto el servidor!");
})