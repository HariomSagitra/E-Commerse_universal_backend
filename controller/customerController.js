import CustomerModal from "../modal/customerModal.js";
import DocumentModal from "../modal/documentModal.js";
import CartModal from "../modal/cartModal.js";
import bcrypt from "bcrypt";
import fs from "fs";
import Payment from "../modal/paymentModel.js";
import crypto from "crypto";
import instance from "../server.js";
import orderModal from "../modal/OrderModal.js";
import dotenv from "dotenv";
dotenv.config({ path: "../config/config.env" });

class CustomerController {
  static editprofile = async (req, res) => {
    const { id } = req.query;
    const { name, mobile, address, city, state, pincode, gender } = req.body;
    console.log(req.body);
    console.log(id);
    var updatedDetails = await CustomerModal.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: name,
          mobile: mobile,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          gender: gender,
          info: Date(),
        },
      },
      {
        new: true,
        newFindAndModify: false,
      },
    );
    console.log(updatedDetails);
    return res.status(200).json({
      msg: "Customer Record Updated Successfully !",
      record: updatedDetails,
    });
  };

  static uploaddocument = async (req, res) => {
  const { customer_id } = req.body;

  try {
    // Purana record delete (sirf DB se)
    await DocumentModal.findOneAndDelete({ customer_id });

    const uploaddata = new DocumentModal({
      customer_id,
      upload_doc: req.file.path, // ✅ Cloudinary URL ONLY
    });

    await uploaddata.save();

    return res.status(200).json({
      msg: "Profile Pic Uploaded Successfully",
      post: uploaddata,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Profile Pic Not Uploaded",
    });
  }
};

  static addtocart = async (req, res) => {
    const {
      product_id,
      product_quantity,
      product_brand,
      product_variant_name,
      product_description,
      product_price,
      product_imageurl,
    } = req.body;

    const { customer_id } = req.query;
    console.log("Customer_Id:", customer_id);

    try {
      let cart = await CartModal.findOne({ customer_id });
      console.log("Cart:==>", cart);
      if (cart) {
        let itemIndex = cart.products.findIndex(
          (p) => p.product_id == product_id,
        );
        console.log("Index:", itemIndex);
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.product_quantity = product_quantity;
          cart.products[itemIndex] = productItem;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({
            product_id,
            product_quantity,
            product_brand,
            product_variant_name,
            product_description,
            product_price,
            product_imageurl,
          });
        }
        var data = await cart.save();
        return res.status(200).json({
          msg: "New Product Added to Cart Successfully",
          carddetails: data,
        });
      } else {
        //no cart for customer, create new cart
        const newCart = new CartModal({
          customer_id,
          products: [
            {
              product_id,
              product_quantity,
              product_brand,
              product_variant_name,
              product_description,
              product_price,
              product_imageurl,
            },
          ],
        });
        const data = await newCart.save();
        return res.status(200).json({
          msg: "Product Added to Cart Successfully",
          carddetails: data,
        });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Product Not Added to Cart",
        err: error,
      });
    }
  };

  static cartdetails = async (req, res) => {
    const { customer_id } = req.query;
    try {
      let cart = await CartModal.findOne({ customer_id });
      console.log("Cart:==>", cart);
      return res.status(200).json({
        cartdetails: cart,
      });
    } catch (error) {
      return res.status(500).json({
        error: error,
      });
    }
  };

  static deletecart = async (req, res) => {
    const { _id, product_id } = req.query;
    console.log(_id, product_id);
    try {
      var cartdetail = await CartModal.findOne({ _id });
      console.log(cartdetail);
      if (cartdetail != null) {
        var newarr = cartdetail.products.filter(
          (cart) => cart.product_id !== product_id,
        );
        console.log(newarr);
        const updatedDetails = await CartModal.findByIdAndUpdate(
          { _id },
          {
            $set: {
              products: newarr,
            },
          },
          {
            new: true,
            newFindAndModify: false,
          },
        );
        return res.status(200).json({
          msg: "Product Deleted Successfully !",
          cart: updatedDetails,
        });
      }
      return res.status(200).json({
        msg: "Product Not Available",
        cart: updatedDetails,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: "Product Not Deleted",
        Error: error,
      });
    }
  };

  static emptycart = async (req, res) => {
    const { customer_id } = req.query;
    try {
      await CartModal.deleteMany({ customer_id });
      return res.status(200).json({
        msg: "Cart is Empty Successfully",
      });
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  };

  static changepassword = async (req, res) => {
    const { id } = req.query;
    const { oldPass, newPass, conPass } = req.body;
    console.log(req.body);
    try {
      if (oldPass && newPass && conPass) {
        const customer = await CustomerModal.findById(id);
        const checkPass = await bcrypt.compare(oldPass, customer.password);
        console.log(checkPass);
        if (checkPass) {
          if (newPass === conPass) {
            const newHashPass = await bcrypt.hash(newPass, 10);
            const updatedCustomer = await CustomerModal.findByIdAndUpdate(
              {
                _id: customer._id,
              },
              {
                $set: {
                  password: newHashPass,
                },
              },
              {
                new: true,
                useFindAndModify: false,
              },
            );
            return res.status(200).json({
              msg: "Password changed successfully",
              record: updatedCustomer,
            });
          } else {
            return res.status(400).json({
              msg: "New password or confirm password doesn't match",
            });
          }
        } else {
          return res.status(400).json({
            msg: "Password doesn't match",
          });
        }
      } else {
        return res.status(400).json({
          msg: "All fields are required",
        });
      }
    } catch (error) {
      return res.status(400).json({
        msg: "Password not changed!",
        error: error,
      });
    }
  };

  static checkout = async (req, res) => {
    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
    };
    console.log("Options:", options);

    try {
      const order = await instance.orders.create(options);
      console.log("Order:", order);
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.log("CheckOut Error:", error);
      res.status(400).json({
        success: false,
        error,
      });
    }
  };

  static paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    console.log("Request Body:", req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log(expectedSignature);

    const isAuthentic = expectedSignature === razorpay_signature;

    console.log(isAuthentic);
    if (isAuthentic) {
      // Database comes here
      var result = await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      console.log(result);
     res.redirect(
  `https://e-commerse-universal-frontent2.onrender.com/customer/paymentsuccess?reference=${razorpay_payment_id}`
);

    } else {
      res.status(400).json({
        success: false,
      });
    }
  };

  static order = async (req, res) => {
    try {
      const { customer_id, orders } = req.body;

      // Check if the customer already has an order
      let existingOrder = await orderModal.findOne({ customer_id });

      if (existingOrder) {
        // Add new orders to the existing order
        existingOrder.orders.push(...orders);
        await existingOrder.save();
        return res.status(200).json({ message: "Order updated successfully" });
      }

      // Create a new order if none exists
      await orderModal.create({ customer_id, orders });
      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Error processing order:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  static orderList = async (req, res) => {
    const { customer_id } = req.query;
    try {
      var orders = await orderModal.find({ customer_id });
      return res.status(200).json({
        orderlist: orders,
      });
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  };

  static profile = async (req, res) => {
    const { id } = req.query;
    try {
      var record = await CustomerModal.findOne({ _id: id });
      return res.status(200).json({
        record: record,
      });
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  };
  static profilepic = async (req, res) => {
    const { id } = req.query;
    try {
      var data = await DocumentModal.findOne({ customer_id: id });
      return res.status(200).json({
        data,
      });
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  };
}

export default CustomerController;
