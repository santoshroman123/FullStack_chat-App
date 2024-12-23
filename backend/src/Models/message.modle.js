import mongoose from "mongoose";

const messageschema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userschemas",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userschemas",
        required:true
    },
    text:{
        type:String,
    },
    image:{
        type:String
    }
})

export default mongoose.model("message",messageschema);