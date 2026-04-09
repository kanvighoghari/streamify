import React from 'react'
import {useChatStore} from "../store/useChatStore"

const ActiveTabSwitch = () => {
  const {activeTabs , setActiveTab} = useChatStore()
  return (
    <div className='tabs tabs-box bg-transparent  p-2 m-1  justify-center items-center'>
      <button onClick={()=>setActiveTab("chats")}
      className={`tab ${
          activeTabs === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`} 
        >Chats</button>

      <button onClick={()=>setActiveTab("groups")} 
                 className={`tab ${
          activeTabs === "groups" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >Group</button>

      <button onClick={()=>setActiveTab("contacts")} 
                className={`tab ${
          activeTabs === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}

        >Contacts</button>

    </div>
  )
}

export default ActiveTabSwitch
