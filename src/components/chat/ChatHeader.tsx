import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setLastMessage, setSelectedUser } from "@/store/slices/chatSlice";

const ChatHeader: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { selectedUser, messages, onlineUsers } = useSelector((store: RootState) => store.chat);
    const { user } = useSelector((store: RootState) => store.auth);

    const handleCloseChat = () => {
        const lastMessage = messages?.[messages.length - 1] ?? "";
        const checkUserId = (userOneId: string, userTwoId: string) => {
            const currentUserId = user?._id;
            if (currentUserId === userOneId) {
                return userTwoId;
            } else {
                return userOneId;
            }
        }

        if(lastMessage) {
            const userId = checkUserId(lastMessage?.senderId, lastMessage?.receiverId);
            if (userId) setLastMessage({userId, message : lastMessage?.text, date :lastMessage?.createdAt});
        }
        dispatch(setSelectedUser(null));
    }
    
    useEffect(() => {},[selectedUser]);
 
    return (
        <div className="p-2 md:p-3 border-b border-base-300 shadow-md bg-blue-50 dark:bg-black z-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="size-8 md:size-10 rounded-full relative">
                            <img src={selectedUser?.profileImage || "/user_avatar.jpg"} alt={selectedUser?.fullName} className="size-8 md:size-10 rounded-full"/>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">{selectedUser?.fullName}</h3>
                        <p className="text-xs md:text-sm text-base-content/70">
                            {selectedUser && onlineUsers?.includes(selectedUser?._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
                <button onClick={handleCloseChat} className="cursor-pointer">
                    <X />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;