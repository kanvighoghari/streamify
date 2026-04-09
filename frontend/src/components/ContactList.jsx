import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UserLoadingSkeleton from "../components/UserLoadingSkeleton"
import { useAuthStore } from '../store/useAuthStore'

const ContactList = () => {
  const{allContacts ,getAllContacts , setSelectedUser , isUserLoading} = useChatStore()
  const {onlineUser} = useAuthStore()

  useEffect(()=>{
    getAllContacts()
  }, [getAllContacts])

   if (isUserLoading) return <UserLoadingSkeleton />;
  return (
    <>
      {allContacts.map((contact)=>(
      <div key={contact._id} className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
       onClick={()=>setSelectedUser(contact)}
      >
        <div className="flex items-center gap-3">
          {/* todo: status  */}
            <div className={`avatar avatar-${onlineUser.includes(contact._id) ? "online" : "offline"} avatar-placeholder`}>
              <div className="size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"}/>
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{contact.username}</h4>
          </div>

      </div>

    ))}
    </>
  )
}

export default ContactList
