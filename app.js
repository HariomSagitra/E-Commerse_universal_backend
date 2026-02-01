
import dotenv from 'dotenv'
dotenv.config(); 
import express from 'express'
import indexRoute from './route/indexRoute.js'
import customerRoute from './route/customerRoute.js'
import adminRoute from './route/adminRoute.js'
import connectDB from './connectdb/dbconnect.js'
// import {getDateTime} from './'
import { getDateTime } from './utility/GetDate.js';

import cors from 'cors'

//dotenv.config({path:"./config.env"})
const app = express()
//const PORT = process.env.PORT_NO||3000
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

/*
CORS or Cross-Origin Resource Sharing in Node. js is a mechanism by which a front-end client can make requests for resources to an external back-end server. The single-origin policy does not allow cross-origin requests and CORS headers are required to bypass this feature.
*/
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true
// }
// app.use(cors(corsOptions));

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       process.env.FRONTEND_URL
//     ],
//     credentials: true
//   })
// );
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());



//Routes
app.use("/",indexRoute)
app.use("/customer",customerRoute)
app.use("/admin",adminRoute)

app.listen(PORT,()=>{
    console.log(`Server Listening at http://localhost:${PORT}`)
})
