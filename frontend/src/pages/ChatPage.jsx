import React from 'react'
import { useChatStore } from '../store/useChatStore'
import BorderAnimated from "../components/BorderAnimated"
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import GroupList from '../components/GroupList';

const ChatPage = () => {
  const {activeTabs, selectedUser , selectedGroup} = useChatStore()
  return (
   <div className="relative w-full max-w-6xl h-[800px]">
    <BorderAnimated>
      {/* left side */}
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTabs === "chats" ? <ChatsList /> : activeTabs === "contacts" ? <ContactList /> : <GroupList />}
          </div>
      </div>
      {/* right side */}
        <div  className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
        {(selectedUser || selectedGroup)? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>

    </BorderAnimated>
     </div>
  )
}

export default ChatPage
