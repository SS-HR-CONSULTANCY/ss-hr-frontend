import type { User } from "../entities/user";
import type { Message } from "../entities/message";
import type { Dispatch, SetStateAction } from "react";

export interface SocketDataInterface {
    fromUserId: Message["senderId"];
    toUserId: Message["receiverId"];
};


export interface ChatBubbleProfileImageProps {
    profileImage: string;
}


export type setLatMessageProps = Pick<Message, "senderId" | "text" | "createdAt">


export type UserProps = Pick<User, "_id" | "fullName" | "profileImg">;


export interface MessageInputProps {
    setIsTyping(data: boolean): void;
    isTyping: boolean;
    setMessageSenderId: Dispatch<SetStateAction<string | null>>;
}
