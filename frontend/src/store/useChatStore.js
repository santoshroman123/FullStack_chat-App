import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js"
import { Socket } from "socket.io-client";
import { useAuthstore } from "./useAuthstore.js";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessageLoading:false,

    getUsers:async ()=>{
        set({isUsersLoading:true});
        try{
          const res=await axiosInstance.get("/message/users");
          set({users:res.data});

        }catch(err){
          console.log(err)
        } finally{
            set({isUsersLoading:false})
        }
    },

    getMessages:async(userId)=>{
        set({isMessageLoading:true});
        try{
          const res=await axiosInstance.get(`/message/${userId}`);
          set({messages:res.data});
        }catch(err){
          console.log(err)
        }
    },
    sendMessage: async (data) =>{
        const {selectedUser,messages}=get();
        try{
          const res=await axiosInstance.post(`/message/send/${selectedUser._id}`,data);
          set({messages:[...messages,res.data]});
        }catch(err){
         console.log(err);
        }
    },
    subscribeToMessages:()=>{
      const {selectedUser} = get();
      if(!selectedUser) return;
      
      const socket =useAuthstore.getState().socket
      
      socket.on("newMessage",(userdata)=>{
        set({
          messages:[...get().messages,userdata]
        })
      })
    },
    unsubscribeFromMessages:()=>{
      const socket =useAuthstore.getState().socket;
      socket.off("newMessage");
    },
    // todo :optimize this on later
    setSelectedUser:async(selectedUser)=>{set({selectedUser})} 
}))