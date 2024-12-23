import user from "../Models/user.model.js";
import messageModle from "../Models/message.modle.js";
import cloudnary from "../lib/cloudnary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getusersforsidebar = async(req,res)=>{
  try{
    
    const loggedInUser=req.user._id;
    console.log("data getting",loggedInUser)
    const filteredusers=await user.find({_id:{$ne:loggedInUser}}).select("-password") //check everything expect this user;

    res.status(200).json(filteredusers);

  }catch(err){
    console.log(err);
    return res.status(500).json({Message:"Internal Server Error"});
  }
}

export const getmessage=async(req,res)=>{
    try{
      const  {id:userToChatId}  =  req.params;
      const myId=req.user._id;

      const message = await messageModle.find({
        $or:[
            { senderId:myId, receiverId:userToChatId},
            { senderId:userToChatId, receiverId:myId}
        ]
      });

     return res.status(200).json(message);

    }catch(err){
        console.log(err);
        return res.status(500).json({Message:"Internal Server Error"});
    }
}

export const sendmessage=async(req,res)=>{
    try{
      const {text,image} = req.body;
      const {id:receiverId} = req.params;  
      const senderId=req.user._id;

      let imageurl;
      if(image){
        const uploadresponse=await cloudnary.uploader.upload(image);
        imageurl=uploadresponse.secure_url;
    }
    const newmessage=new messageModle({
        senderId,
        receiverId,
        text,
        image:imageurl
    })
    await newmessage.save();
    
    // todo : realtime functionality goes here => socket.io
   const receiverSocket=getReceiverSocketId(receiverId);
   if(receiverSocket){
    io.to(receiverSocket).emit("newMessage",newmessage)
   }
   res.status(200).json(newmessage)
  
  
    }catch(err){
        console.log(err);
        return res.status(500).json({Message:"Internal Server Error"});
    }
}