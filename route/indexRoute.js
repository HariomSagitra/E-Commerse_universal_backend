import express from "express";
import IndexController from "../controller/indexController.js";

const router = express.Router()

router.post("/register",IndexController.register)
router.post("/login",IndexController.login)
router.get("/allproduct",IndexController.allproduct)
router.get("/product",IndexController.product)
router.get("/filterproduct",IndexController.filterproduct)

router.post('/senduserpasswordresetemail',IndexController.senduserpasswordresetemail)
router.post('/userpasswordreset',IndexController.userpasswordreset)

export default router