import { axiosInstance } from "@/lib/axios";
import type { RootState } from "@/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Message } from "@/types/entities/message";
import { connectSocket, disconnectSocket } from "../services/socketService";
import type { AdminfetchAllUsersForChatSidebarResponse } from "@/types/apiTypes/admin";
import { addNewMessage, setMessages, setSocketConnected, setSocketDisconnected } from "@/store/slices/chatSlice";

const BASE_URL = import.meta.env.VITE_CHATMODULE_BACKEND_DEV_URL || "http://localhost:4000";

export const getMessages = createAsyncThunk<Array<Message>, { selectedUserId: string }>('message/getMessages',
    async ({ selectedUserId }, thunkAPI) => {
        const response = await axiosInstance.get(`/message/${selectedUserId}`);
        if (response.data.success) {
          console.log("messages : ",response.data.data);
            const messages: Message[] = response.data.data;
            thunkAPI.dispatch(setMessages(messages));
        }
        return thunkAPI.rejectWithValue("Failed to fetch messages");
    }
);

export const sendMessage = createAsyncThunk<Message,{ selectedUserId: string, messageData: FormData}>('messages/sendMessage',
    async ({ selectedUserId, messageData }, thunkAPI) => {
        const response = await axiosInstance.post(`/message/send/${selectedUserId}`, messageData);
        if (response.status === 200) {
            const message: Message = response.data.data;
            console.log("message : ",message);
            return message;
        }
        return thunkAPI.rejectWithValue("Failed to send message");
    }
)


export const connectChatSocket = createAsyncThunk<void, void, { state: RootState }>("chat/connectSocket",
  async (_, { getState, dispatch }) => {
    const authUser = getState().auth.user;
    if (!authUser) return;

    const socket = connectSocket(authUser._id as string, BASE_URL);
    
    socket.on("connect", () => {
      dispatch(setSocketConnected({ socketId: socket.id as string }));
    });

    socket.on("newMessage", (newMessage: Message) => {
        dispatch(addNewMessage(newMessage));
    });

  }
);

export const disconnectChatSocket = createAsyncThunk<void>("chat/disconnectSocket",
  async (_, { dispatch }) => {
    disconnectSocket();
    dispatch(setSocketDisconnected());
  }
);

export const adminFetchUsersFroChatSideBar = async () : Promise<AdminfetchAllUsersForChatSidebarResponse> => {
    const response = await axiosInstance.get('/chat/getUsersForCahtSidebar');
    return response.data.data
}