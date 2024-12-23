import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config({path:"./src/.env"});

const key=process.env.jwt_token

export const generatetoken=(userid,res)=>{
    const token = jwt.sign({userid},key,{expiresIn:"7d"});

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000, //ms
        httpOnly:true,
        sameSite:"strict", //CSRF attacks cross-site request forgery Attacks
        secure:process.env.NODE_ENV !== "development"
    });

    return token;
}

