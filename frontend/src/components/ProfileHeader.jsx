import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon , Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import CreateGroup from './CreateGroup';

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader = () => {
  const { authUser , updateProfile , logout } = useAuthStore()
  const {isSoundEnabled , ToggleSound} = useChatStore()
  const[selectedImg , setSelectedImg] = useState(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const fileInputRef = useRef(null)

 const  handleImageUpload = (e)=>{
  const file = e.target.files[0]
  if(!file) return 

  const reader = new FileReader()
  reader.readAsDataURL(file)

  reader.onloadend = async ()=>{
    const base64Image = reader.result
    setSelectedImg(base64Image)
    await updateProfile({profilePic: base64Image})
  }
 }

  const createGroup = ()=>{
  setShowCreateGroup(true)
  }

  return (
    <>
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           {/* AVATAR */}
           <div className='avatar avatar-online avatar-placeholder group cursor-pointer'>
            <div className="w-14 rounded-full overflow-hidden ">
                <button
                  className="w-full h-full block relative "
                  onClick={() => fileInputRef.current.click()}
                >
                 <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="User image"
                  className="size-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
           </div>

          {/* {username and online text} */}
           <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">{authUser.username}</h3>
            <p className="text-slate-400 text-xs">Online</p>
           </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* create group btn */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={createGroup}
          >
            <Users className="size-5" />
          </button>

          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* sound button */}
            <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              ToggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>

      </div>
      </div>
    </div>
     {showCreateGroup && (
      <CreateGroup onClose={() => setShowCreateGroup(false)} />
    )}
    </>
  )
}

export default ProfileHeader
