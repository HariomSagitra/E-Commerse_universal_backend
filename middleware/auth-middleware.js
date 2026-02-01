import jwt from 'jsonwebtoken'
import CustomerModal from '../modal/customerModal.js'

const checkCustomerAuth = async (req, res, next) => {
    const { authorization } = req.headers
    console.log("Authorization=====>", authorization)
    let token
    try {
        if (authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1]
            console.log("Token=====>", token)
            console.log("=======================")
            const { customer_id } = jwt.verify(token, process.env.JWT_SECRET_KEY)
            console.log("customer_id:", customer_id)
            console.log("=======================")
            req.customer = await CustomerModal.findById(customer_id).select('-password')
            console.log("Customer Details:", req.customer)
            next() 
        }
    } catch (error) {
        return res.status(400).json({
            msg: "Token Expires",
            Error: error
        })
    }

    if (!token) {
        return res.status(401).json({
            msg: "Unauthorized Customer, No Token"
        })
    }

}

export default checkCustomerAuth