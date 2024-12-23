import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import {io} from "socket.io-client";

const baseURL=import.meta.env.MODE==="development" ? "http://localhost:5000" : "/"
export const useAuthstore=create((set,get)=>({
    authUser:null,
    isSignup:false,
    isLoggin:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    isCheckingAuth:true,
    socket:null,

    checkAuth:async () => {
        try{
          const response=await axiosInstance.get("/check");
          set({authUser:response.data});
          get().connectSocket()
        }catch(err){
          console.log(err);
          set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async (data)=>{
        try{
           const res=await axiosInstance.post("/signup",data);
           set({authUser:res.data});
           toast.success("Account created successfully");
           get().connectSocket()
        }catch(err){
           toast.error(err,res.data.Message);
        } 
        finally{
            set({isSignup:false})
        }
    },
    logOut:async()=>{
        try{
            await axiosInstance.post("/logout");
            set({authUser:null});
            toast.success("Logout Successfull");
            get().disconnectSocket()
        }catch(err){
            console.log(err)
        }
    },
    login:async(data)=>{
        set({isLoggin:true})
        try{
            const res=await axiosInstance.post("/login",data);
            set({authUser:res.data});
            toast.success("Login Successfully");

            get().connectSocket()
        }catch(err){
            toast(err,res.data.Message)
        } finally{
            set({isLoggin:false});
        }
        
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});

       try{
         const res = await axiosInstance.put("/update",data);
         set({authUser:res.data})
         toast.success("Profile Updated Successfully")
       }catch(err){
         console.log(err)
       }
       finally{
        set({isUpdatingProfile:false})
       }
    },
    connectSocket:()=>{

        const {authUser} =get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(baseURL,{
            query:{userId:authUser._id}
        });
        socket.connect();
        set({socket:socket});

        socket.on("getOnlineUsers",(data)=>{
            set({onlineUsers:data})
        })
    },
    disconnectSocket:()=>{
       if(get().socket?.connected) get().socket.disconnectSocket()
    }
    
}))