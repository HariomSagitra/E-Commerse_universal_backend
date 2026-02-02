import multer from "multer";
import {getDateTime} from '../utility/GetDate.js'

var storage_engine = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './multipleuploadproducts')
    },
    filename: (req, file, callback) => {
        callback(null, getDateTime() + "_" + file.originalname)
    }
})
var imgupload = multer({storage:storage_engine})
export default imgupload

