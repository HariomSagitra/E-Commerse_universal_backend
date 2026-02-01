// import mongoose from "mongoose";
// // mongoose.connect("mongodb://127.0.0.1:27017")

// const connectDB = async(DB_URL,DB_NAME)=>{
//    try {
//     //await mongoose.connect(DB_URL+DB_NAME)
//     await mongoose.connect("mongodb+srv://hariomsagitra750910_db_user:XmEtsVoBKAO3vlSl@cluster0.hlbfz8a.mongodb.net/?appName=Cluster0")
//     console.log("Database Connected Successfully!!")
//    } catch (error) {
//     console.log("Database not connected",error)
//    } 
// }

// export default connectDB;

import mongoose from "mongoose";
// mongoose.connect("mongodb://127.0.0.1:27017")

const connectDB = async(DB_URL,DB_NAME)=>{
   try {
    //await mongoose.connect(DB_URL+DB_NAME)
    //await mongoose.connect("mongodb+srv://hariomsagitra750910_db_user:XmEtsVoBKAO3vlSl@cluster0.hlbfz8a.mongodb.net/?appName=Cluster0")
    await mongoose.connect(`${DB_URL}${DB_NAME}`)
    console.log("Database Connected Successfully!!")
   } catch (error) {
    console.log("Database not connected",error)
   } 
}

export default connectDB;
