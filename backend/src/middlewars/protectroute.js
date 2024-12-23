import jwt from "jsonwebtoken";
import user from "../Models/user.model.js";
import dotenv from "dotenv"

dotenv.config({path:"./src/.env"});
const key=process.env.jwt_token;

const protectroute=async(req,res,next)=>{
    try{
      const token = req.cookies.jwt;
      if(!token){
        return res.status(400).json({Message:"Unauthorized -No Token Provieded"});
      };
      const decoded=jwt.verify(token,key);

      if(!decoded){
        return res.status(400).json({Message:"Token Invaild"});
      }
      
      const User=await user.findById(decoded.userid).select("-password");
      console.log(User)
      if(!User){
        return res.status(401).json({Message:"User Not Found"});
      }
      req.user=User;
      next()
      
    }catch(err){
         console.log(err);
         return res.status(500).json({Message:"Internal Server Error"});
    }
}

export default protectroute;
