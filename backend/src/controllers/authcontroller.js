import {generatetoken} from "../lib/Utils.js";
import usermodel from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudnary.js"

// Signup Authentication && Verification Code

export const signup=async (req,res)=>{
   const {fullname,email,password}=req.body;

   try{
     if(password.length<6){
        return res.status(400).json({Message:"Password must be at least 6 charaters"})
     }
     const emailverify=await usermodel.findOne({email});

     if(emailverify){
         return res.status(401).json({Message:"You Already Exisiting User"})
     };
     const salt=await bcrypt.genSalt(10);
     const hashpassword=await bcrypt.hash(password,salt);

     const userdata=new usermodel({email:email,fullname:fullname,password:hashpassword});

     if(userdata){
        generatetoken(userdata._id,res);
        await userdata.save();

        res.status(201).json({
            __id:userdata._id,
            fullname:userdata.fullname,
            email:userdata.email,
            profilepic:userdata.profilepic
        });
     }
     else{
        return res.status(400).json({Message:"Invaild User data"});
     }

   }catch(err){
        console.log(err);
        return res.status(500).json({Error:"Server Fault"});
   }
};

// Login Authentication && Veryfication code;

export const login =async (req,res)=>{
   const {email,password}=req.body;
   try{
      const userdata=await usermodel.findOne({email});
      
      if(!userdata){
         return res.status(400).json({Message:"Invaild Credentials"})
      };
      const checkpassword=await bcrypt.compare(password,userdata.password);

      if(!checkpassword){
         return res.status(400).json({Message:"Invaild Password"});
      };
      generatetoken(userdata._id,res);
      
      res.status(200).json({
            __id:userdata._id,
            fullname:userdata.fullname,
            email:userdata.email,
            profilepic:userdata.profilepic,
            Message:"Login successfully"
      });

   }catch(err){
      console.log(err);
      return res.status(500).json({Message:"Internal Server Error"})
   }
};

export const logout=async(req,res)=>{
   try{

     res.cookie("jwt","",{maxAge:0});
     res.status(200).json({Message:"Logout Successfully"});

   }catch(err){
        console.log(err);
        return res.status(500).json({Message:"Internal Server Error"});
   }
}

export const updateprofile=async (req,res)=>{
  try{
     const {profilepic}=req.body;
     const userId = req.user._id;

     if(!profilepic){
      return res.status(400).json({Message:"profilepic id Required"});
     }
     const uploadresponse = await cloudinary.uploader.upload(profilepic);
     const updateuser=await usermodel.findByIdAndUpdate(userId,{profilepic:uploadresponse.secure_url},{new:true});
     
     res.status(200).json(updateuser);

  }catch(err){
   console.log(err);
   return res.status(500).json({Message:"Internal Server Error"});
  }
}

export const checkauth=async (req,res)=>{
   try{
       res.status(200).json(req.user);
   }catch(err){
       console.log(err);
       return res.status(500).json({Message:"Internal Server Error"});
   }
}



