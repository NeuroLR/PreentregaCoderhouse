import express from 'express';
import { ProductRouter } from './routes/ProductRouter.js';
import { CartRouter } from './routes/CartRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productRouter = new ProductRouter().getRouter();
const cartRouter = new CartRouter().getRouter();

app.use("/api", productRouter);
app.use("/api/cart", cartRouter);

app.listen(8080, () => {
    console.log("¡Se levanto el servidor!");
})