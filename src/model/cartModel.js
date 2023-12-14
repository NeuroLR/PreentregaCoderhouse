import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const collection = "carts"

export class CartModal {
    constructor(productId, quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }
}

const cartSchema = mongoose.Schema({
    products: [{
        productId: String,
        quantity: Number
    }]
})

cartSchema.plugin(mongoosePaginate);

const CartModel = mongoose.model(collection, cartSchema);

export default CartModel;

