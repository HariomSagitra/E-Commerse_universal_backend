import mongoose from "mongoose";
const CartSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    products: [
        {
            product_id: {
                type: String,
                required: [true, "Product Id is required"],
                trim: true
            },
            product_quantity: {
                type: Number,
                required: [true, "Product Quantity is required"],
            },
            product_brand: {
                type: String,
                required: [true, "Product Brand is required"],
                trim: true
            },
            product_variant_name: {
                type: String,
                required: [true, "Product Variant Name is required"],
                trim: true
            },
            product_description: {
                type: String,
                required: [true, "Product Description is required"],
                trim: true
            },
            product_price: {
                type: Number,
                required: [true, "Product Price  is required"],
            },
            product_imageurl: {
                type: String,
                required: [true, "Product Image URL is required"],
                trim: true
            },
        }
    ]
});
var cartmodal = mongoose.model("cart", CartSchema);
export default cartmodal