import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UserLoadingSkeleton from "../components/UserLoadingSkeleton"
import NoChatFound from "../components/NoChatFound"

const GroupList = () => {
  const {groups , getUserGroups , isGroupLoading ,setSelectedGroup , getGroupMessages } = useChatStore()

  useEffect(()=>{
    getUserGroups()
  },[getUserGroups])

  if(isGroupLoading) return <UserLoadingSkeleton/>
  if(groups.length === 0 ) return <NoChatFound/>
  return (
    <>
      <>
    {groups.map((group)=>(
      <div key={group._id} className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
       onClick={()=>{
        setSelectedGroup(group)
        getGroupMessages(group._id)
      }}
      >
        <div className="flex items-center gap-3">
          {/* todo: status  */}
            <div className={`avatar`}>
              <div className="size-12 rounded-full">
                <img src={group.profilePic || "/grpAvatar.png"} alt={group.name} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{group.name}</h4>
          </div>

      </div>

    ))}
      
    </>
    </>
  )
}

export default GroupList
