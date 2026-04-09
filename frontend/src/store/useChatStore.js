import {create} from "zustand"
import api from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"



export const useChatStore = create((set,get)=>({
    allContacts:[],
    chats:[],
    groups: [],
    messages:[],
    activeTabs:"chats",
    selectedUser:null,
    selectedGroup:null,
    isUserLoading:false,
    isGroupLoading:false,
    isMessageLoading:false,
    isSoundEnabled:JSON.parse(localStorage.getItem("isSoundEnabled"))===true,

    ToggleSound :()=>{
        localStorage.setItem("isSoundEnabled" , !get().isSoundEnabled)
        set({isSoundEnabled:!get().isSoundEnabled})
    },

    setActiveTab: (tabs)=> set({activeTabs: tabs}),
    setSelectedUser: (selectedUser) => set({ selectedUser, selectedGroup: null }),

    setSelectedGroup: (selectedGroup) => {
     set({ selectedGroup, selectedUser: null });
     if (selectedGroup) {
        const socket = useAuthStore.getState().socket;
        socket.emit("joinGroup", selectedGroup._id); // emit join
     } 
    },

    getAllContacts:async ()=>{
        set({isUserLoading:true})
        try{
        const res = await api.get("/messages/contacts")
        set({allContacts:res.data})
        }catch(error){
            toast.error(error.response.data.messages)
        }finally{
            set({isUserLoading:false})
        }
    },

    getChatPartners: async ()=>{
        set({isUserLoading:true})
        try{
            const res = await api.get("/messages/chats")
            set({chats:res.data})
        }catch(error){
            toast.error(error.response.data.messages)
        }finally{
            set({isUserLoading:false})
        }
    },

    getMessagesByUserId : async(userId)=>{
        set({isMessageLoading:true})
        try{
            const res = await api.get(`/messages/${userId}`)
            set({messages:res.data})
        }catch(error){
              toast.error(error.response?.data?.message || "Something went wrong");
        }finally{
            set({isMessageLoading:false})
        }
    },

    getGroupMessages: async(groupId)=>{
        set({isMessageLoading:true})
        try{
            const res = await api.get(`/groups/messages/${groupId}`)
            
             const normalized = res.data.map(msg => ({
            ...msg,
            senderName: msg.senderId?.username || "Unknown",
            senderId: msg.senderId?._id || msg.senderId  
        }))

        set({messages: normalized})
        }catch(error){
            toast.error(error.response?.data?.message || "Something went wrong");
        }finally{
            set({isMessageLoading:false})
        }
    },

   getUserGroups: async()=>{
    set({isGroupLoading:true})
    try{
        const res = await api.get("/groups/usergroup")
        set({groups:res.data})
    }catch(error){
        toast.error(error.response?.data?.message || "Something went wrong");
    }finally{
        set({isGroupLoading:false})
    }
   },

   createGroup: async ({name , members})=>{
    const {groups} = get()
    const {authUser} = useAuthStore.getState()

    try{
        set({isGroupLoading:true})
        const res = await api.post("/groups/create" ,{name , members})
        set({groups: [...groups, res.data]})

        const socket = useAuthStore.getState().socket
        socket.emit("createGroup" ,{
            groupId: res.data._id,
            members: members
        })


        toast.success("Group created successfully!")
    }catch(error){
        toast.error(error.response?.data?.message || "Failed to create group" )
    }finally{
        set({isGroupLoading:false})
    }

   },

   sendMessage: async (messageData) => {
    const { selectedUser, messages, selectedGroup } = get()
    const { authUser, socket } = useAuthStore.getState()

    const receiverId = selectedUser?._id;
    const groupId = selectedGroup?._id;

    try {
        if (selectedGroup) {
            socket.emit("sendGroupMessage", {
                groupId,
                text: messageData.text,
                image: messageData.image,
            })
        } else {
            const res = await api.post(`/messages/send/${receiverId}`, {
                text: messageData.text,
                image: messageData.image,
            })
            set({ messages: [...messages, res.data] })
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
    }
   },

   subcribeToMessage: ()=>{
  const {selectedUser, selectedGroup, isSoundEnabled} = get()
   if (!selectedUser && !selectedGroup) return 

    const socket = useAuthStore.getState().socket

    socket.on("newMessage" , (newMessage)=>{
        if (selectedUser && newMessage.senderId.toString() !== selectedUser._id.toString()) return
        const currentMessages = get().messages
        set({messages: [...currentMessages , newMessage]})

        
      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; 
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    })
   },

   unScribeToMessage : ()=>{
    const  socket =  useAuthStore.getState().socket
    socket.off("newMessage")
   },

  subscribeToGroupMessages: () => {
    const { selectedGroup, isSoundEnabled } = get();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;

    socket.on("receiveGroupMessage", (newMessage) => {

        if (newMessage.groupId.toString() !== selectedGroup._id.toString()) return;

        const currentMessages = get().messages;
        set({ messages: [...currentMessages, newMessage] });

        if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
        }
     } );
   },

   unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("receiveGroupMessage");
   },

   
}))