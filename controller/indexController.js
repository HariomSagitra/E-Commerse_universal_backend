import customerModal from '../modal/customerModal.js'
import ProductModal from '../modal/productModal.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from '../utility/EmailConfig.js'
dotenv.config({ path: "./config/config.env" })

//npm i bcrypt
//npm i jsonwebtoken

class IndexController {

    static register = async (req, res) => {
        const { name, email, password, mobile, gender, state, city, pincode, address } = req.body
        console.log(name, email, password, mobile, gender, state, city, pincode, address)

        try {
            var isExists = await customerModal.findOne({ email })
            console.log("Single Record:", isExists)
            if (isExists) {
                return res.status(200).json({
                    msg: "Email is already exists"
                })
            }
            //generate hashpassword
            var hashpassword = await bcrypt.hash(password, 10)
            console.log("hashpassword:", hashpassword)

            const cust = new customerModal({
                name: name,
                email,
                password: hashpassword,
                mobile,
                gender,
                state,
                city,
                pincode,
                address
            })
            const data = await cust.save()
            res.status(200).json({
                "record": data,
                "msg": "Customer Register Successfully",
            })
        } catch (error) {
            return res.status(404).json({
                msg: "Customer Not Register",
                err: error
            })
        }
    }

    static login = async (req, res) => {
        const { email, password, } = req.body
        console.log(email, password)

        try {
            var customer = await customerModal.findOne({ email })
            console.log("Single Record:", customer)
            if (customer != null) {
                var isMatch = await bcrypt.compare(password, customer.password)
                console.log(isMatch)
                if (customer.email === email && isMatch) {
                    const token = jwt.sign({ customer_id: customer._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                    return res.status(200).json({
                        token: token,
                        record: customer,
                        msg: "Login Successfully",
                    })
                }
                else {
                    return res.status(400).json({
                        "msg": "Email or Password is inValid",
                    })
                }
            } else {
                return res.status(400).json({
                    "msg": "Email Not Registered",
                })
            }
        } catch (error) {
            return res.status(404).json({
                msg: "Login Failed",
                err: error
            })
        }
    }

    static allproduct = async (req, res) => {
        try {
            var products = await ProductModal.find()
            return res.status(200).json({
                "allproduct": products
            })
        } catch (error) {
            return res.status(400).json({
                "msg": "Products Not Available"
            })
        }
    }
    static product = async (req, res) => {
        const {product_id} = req.query
        try {
            var product = await ProductModal.findOne({_id:product_id})
            return res.status(200).json({
                "singleproduct": product
            })
        } catch (error) {
            return res.status(400).json({
                   error
            })
        }
    }

    static senduserpasswordresetemail = async (req, res) => {
        const { email } = req.body
        try {
            if (email) {
                const customer = await customerModal.findOne({ email })
                if (customer) {
                    const secret = customer._id + process.env.JWT_SECRET_KEY
                    const token = jwt.sign({ customer_id: customer._id }, secret, { expiresIn: '30m' })

                    const link = "http://localhost:3000/forgotpassword?id=" + customer._id + "&token=" + token

                    console.log("Link:====>", link)
                    var mailOptions = {
                        from: process.env.EMAIL_USER, // sender address
                        to: customer.email, // list of receivers
                        subject: "Reset Password", // Subject line
                        text: "Link for Password Reset", // plain text body
                        html: "<h3>Hii " + customer.name + ",Please copy this link <a href=" + link + "> and reset your password</a></h3>"
                    }
                    await transporter.sendMail(mailOptions)
                    return res.status(200).json({
                        msg: "Password Reset Email Send...Please Check Your Email",
                        id: customer._id,
                        token: token
                    })
                } else {
                    return res.status(400).json({
                        msg: "Email does not exists.",
                    })
                }
            } else {
                return res.status(400).json({
                    msg: "Email Fields are required",
                })
            }
        } catch (error) {
            return res.status(400).json({
                error
            })
        }

    }

    static userpasswordreset = async (req, res) => {
        const { password, confirm_password } = req.body
        const { id, token } = req.query
        console.log("get:===>", id, token)
        console.log(password, confirm_password)
        try {
            const customer = await customerModal.findById(id)
            const new_secret = customer._id + process.env.JWT_SECRET_KEY
            const { customer_id } = jwt.verify(token, new_secret)
            console.log(customer_id)
            if (password && confirm_password) {
                if (password !== confirm_password) {
                    return res.status(400).json({
                        msg: "New Password and Confirm Password doesn't match",
                    })
                } else {
                    const newHashPassword = await bcrypt.hash(password, 10)
                    console.log(newHashPassword)
                    const data = await customerModal.findByIdAndUpdate({ _id: customer._id },
                        {
                            $set:
                            {
                                password: newHashPassword
                            }
                        },
                        {
                            new: true,
                            useFindAndModify: false
                        })
                    return res.status(200).json({
                        msg: "Password reset successfully",
                        record: data
                    })
                }
            } else {
                return res.status(400).json({
                    msg: "All Fields required",
                })
            }
        } catch (error) {
            return res.status(400).json({
                msg: "Invalid Token"
            })
        }

    }

     static filterproduct = async (req, res) => {
        try {
            const { product_variant_name, priceMin, priceMax, ratingMin, inStock } = req.query;
            console.log(req.query)

            // Build filter object
            let filter = {};

            if (product_variant_name) {
                // Split comma-separated string into an array
                const categoryFilter = product_variant_name
                    ? product_variant_name.split(',').map(cat => cat.trim())
                    : [];
                filter = categoryFilter.length > 0
                    ? { product_variant_name: { 
                        $in: categoryFilter } }
                    : {};
                console.log(filter)    
                // filter.product_category = filter;
            }
            if (priceMin || priceMax) {
                filter.product_sellingprice = {};
                if (priceMin)
                    filter.product_sellingprice.$gte = priceMin;
                if (priceMax)
                    filter.product_sellingprice.$lte = priceMax;
            }
            if (ratingMin) {
                filter.product_rating = { $gte: ratingMin };
            }
            if (inStock) {
                filter.product_availability = "In Stock"
            }
            console.log(filter)
            // Fetch products based on filters
            const products = await ProductModal.find(filter);
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

}

export default IndexController