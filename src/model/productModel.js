import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const collection = "products"

export class ProductModel {
    constructor(title, description, code, price, status = true, thumbnail, stock, category) {
        this.id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.status = status;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
    }
}

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    status: Boolean,
    thumbnail: String,
    code: String,
    stock: Number,
    category: String
})

productSchema.plugin(mongoosePaginate);

const model = mongoose.model(collection, productSchema);

export default model;