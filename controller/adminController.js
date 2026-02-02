import ProductModal from "../modal/productModal.js";
import customerModal from "../modal/customerModal.js";
import dotenv from "dotenv";
dotenv.config();

class AdminController {

  // ================= ADD PRODUCT =================
  static addproduct = async (req, res) => {
    try {
      const {
        product_brand,
        product_variant_name,
        product_description,
        product_mrp,
        product_sp,
        product_discount,
        product_size,
        product_color,
        product_quantity,
        product_availability,
      } = req.body;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "Images are required" });
      }

      const newprod = req.files.map(file => ({
        type: file.mimetype,
        name: file.originalname,
        path: file.path,   // ✅ Cloudinary URL
        size: file.size
      }));

      const uploadproduct = new ProductModal({
        product_brand,
        product_variant_name,
        product_description,
        product_mrp,
        product_sp,
        product_discount,
        product_size,
        product_color,
        product_quantity,
        product_availability,
        product_imageurl: newprod,
      });

      await uploadproduct.save();

      return res.status(201).json({
        msg: "Product added successfully",
        product: uploadproduct,
      });

    } catch (error) {
      console.error("ADD PRODUCT ERROR 👉", error);
      return res.status(500).json({
        msg: "Internal server error",
        error: error.message,
      });
    }
  };

  // ================= DELETE PRODUCT =================
  static deleteproduct = async (req, res) => {
    try {
      const { product_id } = req.query;

      await ProductModal.findByIdAndDelete(product_id);

      return res.status(200).json({
        msg: "Product Deleted Successfully",
      });

    } catch (error) {
      return res.status(400).json({
        msg: "Product not Deleted",
        error: error.message,
      });
    }
  };

  // ================= EDIT PRODUCT =================
  static editproduct = async (req, res) => {
    try {
      const { product_id } = req.query;
      const updateData = req.body;

      if (req.files && req.files.length > 0) {
        const newprod = req.files.map(file => ({
          type: file.mimetype,
          name: file.originalname,
          path: file.path,   // ✅ Cloudinary URL
          size: file.size
        }));

        updateData.product_imageurl = newprod;
      }

      const updatedProduct = await ProductModal.findByIdAndUpdate(
        product_id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ msg: "Product not found" });
      }

      return res.status(200).json({
        msg: "Product Updated Successfully",
        product: updatedProduct,
      });

    } catch (error) {
      return res.status(400).json({
        msg: "Product Not Updated",
        error: error.message,
      });
    }
  };

  // ================= ALL CUSTOMERS =================
  static allcustomer = async (req, res) => {
    try {
      const customers = await customerModal.find();
      return res.status(200).json({ record: customers });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  // ================= MANAGE CUSTOMER =================
  static managecustomerstatus = async (req, res) => {
    const { id, s } = req.query;

    try {
      if (s === "block") {
        await customerModal.findByIdAndUpdate(id, { status: 0 });
      } else if (s === "verify") {
        await customerModal.findByIdAndUpdate(id, { status: 1 });
      } else {
        await customerModal.findByIdAndDelete(id);
      }

      return res.status(200).json({ msg: "Action successful" });

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
}

export default AdminController;
