import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UserLoadingSkeleton from "../components/UserLoadingSkeleton"
import NoChatFound from "../components/NoChatFound"
import { useAuthStore } from '../store/useAuthStore'

const ChatsList = () => {
  const {chats , getChatPartners , isUserLoading , setSelectedUser} = useChatStore()
  const {  onlineUser} = useAuthStore()

  useEffect(()=>{
    getChatPartners()
  },[getChatPartners])

  if(isUserLoading) return <UserLoadingSkeleton/>
  if(chats.length === 0 ) return <NoChatFound/>
  return (
    <>
    {chats.map((chat)=>(
      <div key={chat._id} className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
       onClick={()=>setSelectedUser(chat)}
      >
        <div className="flex items-center gap-3">
          {/* todo: status  */}
            <div className={`avatar avatar-${onlineUser.includes(chat._id) ? "online" : "offline"} avatar-placeholder `}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.username} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.username}</h4>
          </div>

      </div>

    ))}
      
    </>
  )
}

export default ChatsList
