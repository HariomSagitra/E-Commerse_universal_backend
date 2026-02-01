import dotenv from 'dotenv'
dotenv.config({path:"./config/config.env"})
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, //admin email
        pass: process.env.EMAIL_PASS  //admin pass
    }
});
export default transporter
