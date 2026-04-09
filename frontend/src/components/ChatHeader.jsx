import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { XIcon } from "lucide-react";
import { useAuthStore } from '../store/useAuthStore';

const ChatHeader = () => {
    const {selectedUser , setSelectedUser , setSelectedGroup , selectedGroup} = useChatStore()
    const {onlineUser} = useAuthStore()
   const isOnline = selectedUser ? onlineUser.includes(selectedUser._id.toString()) : false;

    useEffect(()=>{
        const handleEscKey = (event)=>{
            if(event.key==="Escape") {
                setSelectedUser(null)
                setSelectedGroup(null)
            }
        }

        window.addEventListener("keydown" , handleEscKey)
        return ()=> window.removeEventListener("keydown" , handleEscKey)
    },[setSelectedUser , setSelectedGroup])


   const isGroup = !!selectedGroup && !selectedUser;
 const chatAvatar = isGroup
  ? selectedGroup.avatar || "/grpAvatar.png"
  : selectedUser?.profilePic || "/avatar.png";

  const displayName = isGroup 
  ? selectedGroup.name 
  : selectedUser?.username || "Select a chat";


  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">

      <div className="flex items-center space-x-3">

        <div className={`avatar ${isOnline? "online": "offline"}`}>
          <div className="w-12 rounded-full">
            <img src={ chatAvatar} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{displayName}</h3>
            {!isGroup && selectedUser && (
            <p className="text-slate-400 text-sm">{isOnline? "Online" : "Offline"}</p>
          )}
        </div>
      </div>

       <button onClick={() =>{ 
        setSelectedUser(null)  
        setSelectedGroup(null)
        }}>
         <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
       </button>
    </div>
  )
}

export default ChatHeader
