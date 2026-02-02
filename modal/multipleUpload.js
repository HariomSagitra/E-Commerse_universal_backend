// import multer from "multer";
// import {getDateTime} from '../utility/GetDate.js'

// var storage_engine = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, './multipleuploadproducts')
//     },
//     filename: (req, file, callback) => {
//         callback(null, getDateTime() + "_" + file.originalname)
//     }
// })
// var imgupload = multer({storage:storage_engine})
// export default imgupload

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

export default upload;
