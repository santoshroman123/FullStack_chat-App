import {v2 as cloudnary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config({path:"./src/.env"});

 cloudnary.config({
    cloud_name:process.env.cloudnary,
    api_key:process.env.cloudnary_key,
    api_secret:process.env.cloudnary_secret
})

export default cloudnary;
