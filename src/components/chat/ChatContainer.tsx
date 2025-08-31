import ChatHeader from "./ChatHeader";
import { Ellipsis } from "lucide-react";
import MessageInput from "./MessageInput";
import { useMessage } from "@/hooks/useSocketHook";
import { getMessages } from "@/utils/apis/chatApi";
import { useDispatch, useSelector } from "react-redux";
import type { Message } from "@/types/entities/message";
import React, { useEffect, useRef, useState } from "react";
import type { AppDispatch, RootState } from "@/store/store";
import ChatBubbleProfileImage from "./ChatBubbleProfileImage";
import { formatTo24HourTime } from "@/utils/helpers/chatHelper";
import NoChatSelectedSShimmer from "../shimmer/NoChatSelectedSShimmer";
import type { SocketDataInterface } from "@/types/componentTypes/chatTypes";

const ChatContainer: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [messageSenderId, setMessageSenderId] = useState<string | null>(null);
    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const { selectedUser, chatSocket, messages, isMessagesLoading } = useSelector((store: RootState) => store.chat);
    const { user } = useSelector((store: RootState) => store.auth);
    const { subscribeToMessages, unsubscribeFromMessages } = useMessage();

    useEffect(() => {
        if (!selectedUser || !user) return;

        dispatch(getMessages({ selectedUserId: selectedUser._id }));
        subscribeToMessages();

        return () => {
            unsubscribeFromMessages();
        };
    }, [dispatch, selectedUser, user]);

    useEffect(() => {
        if (messageEndRef.current && (messages || isTyping)) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (!chatSocket || !user) return;

        chatSocket.on("typing", (socketData: SocketDataInterface) => {
            const { fromUserId, toUserId } = socketData;
            if (fromUserId === selectedUser?._id && toUserId === user._id) {
                setMessageSenderId(fromUserId);
                setIsTyping(true);
            }
        });

        chatSocket.on("stopTyping", (socketData: SocketDataInterface) => {
            const { fromUserId, toUserId } = socketData;
            if (fromUserId === selectedUser?._id && toUserId === user._id) {
                setIsTyping(false);
                setMessageSenderId(fromUserId);
            }
        });

        return () => {
            chatSocket.off("typing");
            chatSocket.off("stopTyping");
        };
    }, [chatSocket, selectedUser]);

    if (!selectedUser) return <NoChatSelectedSShimmer className="w-9/12" />;

    return (
        <div className="w-full md:w-8/12 flex flex-col overflow-auto mt-5 md:mt-0">
            <ChatHeader />
            {isMessagesLoading ? (
                <NoChatSelectedSShimmer className="w-full" />
            ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages?.map((message: Message, index: number) => (
                        <div key={index}
                            className={`flex ${message.senderId === user?._id ? "justify-end" : "justify-start"}`}
                            ref={messageEndRef}
                        >
                            {message.senderId !== user?._id && (
                                <ChatBubbleProfileImage profileImage={selectedUser?.profileImage || "/user_avatar.jpg"} />
                            )}

                            <div className={`flex flex-col rounded-md bg-[var(--menuItemHoverBg)] px-4 py-2 max-w-8/12 ${message.senderId !== user?._id ? "ml-3" : "mr-3"}`}>
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && (
                                    <p className="text-[13px] md:text-[15px]">{message.text}</p>
                                )}
                                <time className="text-[10px] md:text-xs opacity-50 ml-auto">
                                    {formatTo24HourTime(message.createdAt)}
                                </time>
                            </div>

                            {message.senderId === user?._id && (
                                <ChatBubbleProfileImage profileImage={user?.profileImage || "/user_avatar.jpg"} />
                            )}

                        </div>
                    ))}
                </div>
            )}

            {isTyping && user?._id !== messageSenderId && (
                <div className="px-4 pb-2 flex">
                    <div className="justify-start rounded-md bg-[var(--menuItemHoverBg)] px-4 py-2">
                        <div className="chat-bubble flex rounded-md justify-center items-center">
                            <p className="text-[13px] md:text-[15px]">Typing</p>
                            <Ellipsis className="animate-ping" />
                        </div>
                    </div>
                </div>
            )}

            <MessageInput
                setIsTyping={setIsTyping}
                isTyping={isTyping}
                setMessageSenderId={setMessageSenderId}
            />
        </div>
    );
};

export default ChatContainer;
