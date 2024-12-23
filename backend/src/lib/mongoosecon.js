import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config({path:"./src/.env"});
const mongo_uri=process.env.mongo_uri;

mongoose.connect(mongo_uri)
.then(()=>{console.log("MongoDB Connected Successfully")})
.catch((err)=>{console.log("Error Catched",err)})

export default mongoose;