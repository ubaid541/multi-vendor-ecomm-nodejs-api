import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()
import routes from "./routes/index.js"
dotenv.config()

// database connnection
//const url = 'mongodb://localhost/fyp_react';

const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Database connected.");
    } catch (error) {
        console.log(error.message);
    }
}

mongoose.connection.on("disconnected",()=>{
    console.log("Database disconnected.");
})

// middlwares
app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use('/uploads', express.static('uploads'));


// api
app.use("/",routes)

// error handle middlware
app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong."
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack : err.stack
    })
})

// deploy to heroku
if(process.env.NODE_ENV == "production"){
    app.use(express.static("admin/build"))
    app.use(express.static("customer/build"))
}
// ends

const PORT = process.env.PORT || 9000

app.listen(PORT,()=>{
    connect()
    console.log("Server connected to port 9000");
})