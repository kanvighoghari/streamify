import React, { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const CreateGroup = ({ onClose }) => {
  const { allContacts, getAllContacts, createGroup } = useChatStore();
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    getAllContacts();
  }, []);

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleSubmit = async () => {
    if (!groupName) return toast.error("Enter a group name!");
    if (selectedMembers.length === 0) return toast.error("Select members!");

    await createGroup({ name: groupName, members: selectedMembers });
    onClose();
  };

  return (
    // Overlay covers main chat, not full page
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
      {/* Sidebar-style panel */}
      <div className="bg-[#1e293b] w-80 p-6 h-full shadow-lg overflow-y-auto">
        <h2 className="text-white text-xl font-semibold mb-4">Create Group</h2>

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Group Name"
          className="w-full p-2 mb-4 bg-[#334155] text-white rounded border border-[#475569] focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Contacts List */}
        <div className="space-y-2 mb-4">
          {allContacts.map((contact) => (
            <div
              key={contact._id}
              className="flex items-center gap-3 p-2 bg-[#334155] rounded cursor-pointer hover:bg-[#475569]"
              onClick={() => toggleMember(contact._id)}
            >
              <input
                type="checkbox"
                checked={selectedMembers.includes(contact._id)}
                onChange={() => toggleMember(contact._id)}
                className="w-4 h-4 accent-cyan-400"
              />
              <div className="avatar size-8 rounded-full overflow-hidden">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.username}
                  className="w-8 h-8 object-cover"
                />
              </div>
              <span className="text-white truncate">{contact.username}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
