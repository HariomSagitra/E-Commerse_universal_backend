import dotenv from "dotenv";
dotenv.config();

console.log("RAZORPAY KEY =", process.env.RAZORPAY_API_KEY);

// //dotenv.config();
// dotenv.config({
//     path:"./config/config.env"
// })
import Razorpay from "razorpay";


var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
})

console.log(process.env.RAZORPAY_API_KEY,process.env.RAZORPAY_API_SECRET)
console.log("instance obj--->", instance.orders)

export default instance;