import express from 'express';
import { ProductRouter } from './routes/ProductRouter.js';
import { CartRouter } from './routes/CartRouter.js';
import handlebars from "express-handlebars";
import __dirname from './utils.js';
import { Server } from 'socket.io';
import { HomeRouter } from './routes/HomeRouter.js';
import { RealTimeProducts } from './routes/RealTimeProducts.js';
import { ProductModel, ProductManager } from './productManager.js';


const productRouter = new ProductRouter().getRouter();
const cartRouter = new CartRouter().getRouter();
const homeRouter = new HomeRouter().getRouter();
const realTimeProducts = new RealTimeProducts().getRouter();

const app = express();
const server = app.listen(8080, () => console.log("¡Se levanto el servidor!"));
const socketServer = new Server(server);

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));

app.use("/api", productRouter);
app.use("/api/cart", cartRouter);

app.use("/home", homeRouter);
app.use("/realtimeproducts", realTimeProducts);

const pm = new ProductManager("./src/productos.json")

socketServer.on("connection", socket => {
    console.log("nuevo cliente conectado");
    socket.on("message", data => {
        console.log(data)
    })

    socket.on("addProduct", (title, description, code, price, thumbnail, stock, category) => {
        const productModel = new ProductModel(title, description, code, price, true, thumbnail, stock, category);
        const result = pm.addProduct(productModel);

        socket.emit("addProduct", result);
    }) 

    socket.on("deleteProduct", pid => {
        const result = pm.deleteProduct(pid);
        socket.emit("deleteProduct", result);
    })
})