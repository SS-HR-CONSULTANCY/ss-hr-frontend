import React from "react";
import type { ChatBubbleProfileImageProps } from "@/types/componentTypes/chatTypes";

const ChatBubbleProfileImage: React.FC<ChatBubbleProfileImageProps> = ({
  profileImage = "/user_avatar.jpg",
}) => {
  return (
    <div className="chat-image mr-2">
      <img
        src={profileImage}
        className="size-6 md:size-8 rounded-full border"
        alt="profile pic"
      />
    </div>
  );
};

export default ChatBubbleProfileImage;
