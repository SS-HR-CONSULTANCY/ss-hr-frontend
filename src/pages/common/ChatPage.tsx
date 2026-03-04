import React, { useEffect } from "react";
import Loading from "./LoadingPage";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatContainer from "@/components/chat/ChatContainer";
import { connectChatSocket, disconnectChatSocket } from "@/utils/apis/chatApi";
import {
  adminFetchUsersFroChatSideBar,
  userFetchUsersFroChatSideBar,
} from "@/utils/apis/chatApi";

const ChatPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?._id) {
      dispatch(connectChatSocket());
    }
    return () => {
      dispatch(disconnectChatSocket());
    };
  }, [user?._id, dispatch]);

  if (!user) return <Loading />;

  return (
    <div className="h-full flex shadow-md rounded-md border bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black">
      <ChatSidebar
        getUsers={
          user?.role === "user"
            ? userFetchUsersFroChatSideBar
            : adminFetchUsersFroChatSideBar
        }
      />
      <ChatContainer />
    </div>
  );
};

export default ChatPage;
