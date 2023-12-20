import express from 'express';
import { ProductRouter } from './routes/ProductRouter.js';
import { CartRouter } from './routes/CartRouter.js';
import handlebars from "express-handlebars";
import __dirname from './utils.js';
import { Server } from 'socket.io';
import { HomeRouter } from './routes/HomeRouter.js';
import { RealTimeProducts } from './routes/RealTimeProducts.js';
import { ProductManager } from './productManager.js';
import { ProductModel } from './model/productModel.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const productRouter = new ProductRouter().getRouter();
const cartRouter = new CartRouter().getRouter();
const homeRouter = new HomeRouter().getRouter();
const realTimeProducts = new RealTimeProducts().getRouter();

app.use("/api", productRouter);
app.use("/api/carts", cartRouter);
app.use("/home", homeRouter);
app.use("/realtimeproducts", realTimeProducts);

const pm = new ProductManager("./src/productos.json");

const server = app.listen(8080, () => console.log("¡Se levanto el servidor!"));
const socketServer = new Server(server);

const mongooseURI = "mongodb+srv://gabrielgarcia:contraseña@cursocorderhouse.2aal54j.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongooseURI).catch(error => {
    if (error) {
        console.error("No se pudo conectar a la base de datos", error);
        process.exit();
    }
})

socketServer.on("connection", socket => {
    console.log("nuevo cliente conectado");
    socket.on("message", data => {
        console.log(data)
    })

    socket.on("addProduct", async (title, description, code, price, thumbnail, stock, category) => {
        try {
            const result = await pm.addProductDB(title, description, code, price, true, thumbnail, stock, category);
            console.log(result)
            socket.emit("addProduct", result);
        } catch(err) {
            console.log(err)
        }
    }) 

    socket.on("deleteProduct", async (pid) => {
        try {
            const result = await pm.deleteProductDB(pid);
            console.log(result)
            socket.emit("deleteProduct", pid);
        } catch (error) {
            console.log(error)
        }
    })
})