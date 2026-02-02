import fs from "fs";

const uploadDir = "./multipleuploadproducts";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


import dotenv from 'dotenv'
dotenv.config(); 
import express from 'express'
import indexRoute from './route/indexRoute.js'
import customerRoute from './route/customerRoute.js'
import adminRoute from './route/adminRoute.js'
import connectDB from './connectdb/dbconnect.js'

import { getDateTime } from './utility/GetDate.js';

import cors from 'cors'


const app = express()

const PORT = process.env.PORT || 3000


console.log("Current Date & Time:",getDateTime())

//Returns middleware that only parses json 
app.use(express.json())

//Returns middleware that only parses urlencoded bodies 
app.use(express.urlencoded())

//Document Upload
app.use('/uploaddocuments',express.static('uploaddocuments'))
app.use('/multipleuploadproducts',express.static('multipleuploadproducts'))

//Database
connectDB(process.env.DB_URL,process.env.DB_NAME)


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));





//Routes
app.use("/",indexRoute)
app.use("/customer",customerRoute)
app.use("/admin",adminRoute)

app.listen(PORT,()=>{
    console.log(`Server Listening at http://localhost:${PORT}`)
})
