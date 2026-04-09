import {create} from "zustand"
import api from "../lib/axios.js"
import toast from "react-hot-toast"
import {io} from "socket.io-client"
import { useChatStore } from "./useChatStore.js"

const baseUrl = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/"

export const useAuthStore = create((set,get)=>({
    
    authUser: null,
    isCheckingAuth: true,
    isSigningUp : false,
    isLogginIn :false,
    isLoggingOut : false,
    socket:null,
    onlineUser:[],

    checkAuth : async ()=>{
        try{
            const res = await api.get("/auth/check");
            set({authUser: res.data})
            get().connectSocket()
        }catch(err){
            console.log("error in authCheck:" , err)
             set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signUp : async (data)=>{
        set({isSigningUp :true})
        try{
            const res = await api.post("/auth/signup" ,data)
            set({authUser:res.data})
            toast.success("Account created successfully!")

            get().connectSocket()
        }catch(error){
            toast.error(error.response.data.message)

        }finally{
            set({isSigningUp :false})
        }
    },

    login : async(data)=>{
        set({isLogginIn:true})
        try{
            const res = await api.post("/auth/login" , data)
            set({authUser:res.data})
            toast.success("Logged In successfully!")

            get().connectSocket()
        }catch(error){
            toast.error(error.response?.data?.message || "Login failed")
        }finally{
            set({isLogginIn :false})
        }
    },

    logout: async()=>{
      set({isLoggingOut : true})
        try{
            await api.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
            get().disconnectSocket()
        }catch(error){
            toast.error("Error logging out");
            console.log("Logout error:", error);
        }finally{
             set({isLoggingOut : false})
        }
    },

    updateProfile: async (data)=>{
        try{
            const res = await api.put("/auth/update-profile" , data)
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        }catch(error){
            console.log("Error in update profile:", error);
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    },

   connectSocket: () => {
        const { authUser, socket } = get();
            console.log("connectSocket called for:", authUser?.username)

        if (!authUser || socket?.connected) return;

        const newSocket = io(baseUrl, { withCredentials: true ,transports: ["websocket"]});
        console.log("Connecting to:", baseUrl);

        newSocket.connect();

        set({ socket: newSocket }); 

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUser: userIds });
        });
   },


   disconnectSocket : ()=>{
      if(get().socket?.connected)  get().socket.disconnect()
   }


}))