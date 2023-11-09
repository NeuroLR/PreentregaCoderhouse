import express from 'express';
import { ProductRouter } from './routes/ProductRouter.js';
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productRouter = new ProductRouter().getRouter();

app.use("/api", productRouter);

app.listen(8080, () => {
    console.log("¡Se levanto el servidor!");
})