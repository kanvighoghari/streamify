import React, { useEffect , useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import {useAuthStore} from "../store/useAuthStore"
import ChatHeader from './ChatHeader'
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder'
import MessageInput from './MessageInput'
import MessageLoadingSkeleton from './MessageLoadingSkeleton'

const ChatContainer = () => {

  const {messages ,
     selectedUser ,
     selectedGroup,
     unsubscribeFromGroupMessages, 
     getGroupMessages,   
     getMessagesByUserId , 
     isMessageLoading , 
     subcribeToMessage ,
     subscribeToGroupMessages, 
     unScribeToMessage} = useChatStore()
     
  const {authUser} = useAuthStore()

   const messagesEndRef = useRef(null)

  useEffect(()=>{
        if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id)
    } else if (selectedGroup?._id) {
      getGroupMessages(selectedGroup._id)
    }

    if (selectedUser) {
  subcribeToMessage()
} else if (selectedGroup) {
  subscribeToGroupMessages()  
}

return () => {
  unScribeToMessage()
  unsubscribeFromGroupMessages()  
}


  },[selectedUser,getMessagesByUserId, getGroupMessages,selectedGroup , subcribeToMessage , unScribeToMessage])

    useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])



     const chatName = selectedGroup?.name || selectedUser?.username || null

  return (
    <>
      <ChatHeader  />
    
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {messages.length>0 && !isMessageLoading ? (
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map(msg=>(
              <div key={msg._id} className={`chat ${msg.senderId.toString() === authUser._id.toString() ? "chat-end" : "chat-start"}`}>
                 {selectedGroup && msg.senderId.toString() !== authUser._id.toString() && (
                      <div className="chat-header text-xs text-slate-400 mb-1">
                          {msg.senderName}
                      </div>
                  )}
                
                <div className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}>
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",  
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
              <div ref={messagesEndRef} />
            </div>
        ) : isMessageLoading ? <MessageLoadingSkeleton/> : <NoChatHistoryPlaceholder name={chatName || "Select a chat to start messaging"} />}
      </div>

      <MessageInput/>
    </>
  )
}

export default ChatContainer
