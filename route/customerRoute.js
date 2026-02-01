import express from "express";
import CustomerController from "../controller/customerController.js";
import checkCustomerAuth from "../middleware/auth-middleware.js";
import imgUpload from '../modal/singleUpload.js'

const router = express.Router()

//middleware route
router.use("/editprofile",checkCustomerAuth)
router.post('/changepassword',checkCustomerAuth)

//customer route
router.put("/editprofile",CustomerController.editprofile)
router.post('/uploaddocument',imgUpload.single("upload_doc"),CustomerController.uploaddocument)
router.post('/cart',CustomerController.addtocart)
router.get('/cartdetails',CustomerController.cartdetails)
router.put('/deletecart',CustomerController.deletecart)
router.get('/profile',CustomerController.profile)
router.get('/profilepic',CustomerController.profilepic)
router.get('/emptycart',CustomerController.emptycart)
router.post('/changepassword',CustomerController.changepassword)

router.post('/checkout',CustomerController.checkout)
router.post('/paymentverification',CustomerController.paymentVerification)
router.post('/orders',CustomerController.order)
router.get('/orderlist',CustomerController.orderList)
router.get('/getkey', (req, res) =>
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);


export default router