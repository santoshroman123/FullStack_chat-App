import express from "express";
// const app=express();
import dotenv from "dotenv"
import router from "./Routes/auth.route.js"
import messagerouter from "./Routes/messageroute.js"
import mongoose from "./lib/mongoosecon.js"
import cookieparser from "cookie-parser";
import {app,server,io} from "./lib/socket.js";
import path from "path";
import cors from "cors";



app.use(cors({origin:"http://localhost:3000",credentials:true}))
dotenv.config({path:"./src/.env"});
const port=process.env.port;
const __dirname=path.resolve();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser())

app.use("/auth/user",router);
app.use("/auth/user/message",messagerouter);

if(process.env.MODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}

server.listen(port,()=>{
    console.log("Server connected",port)
})