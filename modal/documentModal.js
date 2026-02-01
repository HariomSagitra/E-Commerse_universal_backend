import mongoose from "mongoose";
const Schema = mongoose.Schema;

const documentSchema = mongoose.Schema({
    upload_doc:{
        type:String,
        required:[true,"Image is required"],
        trim:true
    },
    customer_id: { 
        type: Schema.Types.ObjectId, 
        ref: "Customer" 
    },
})
const documentmodal = mongoose.model("Document",documentSchema)

export default documentmodal