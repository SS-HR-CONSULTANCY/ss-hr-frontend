import { axiosInstance } from "@/lib/axios";
import type { RootState } from "@/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Message } from "@/types/entities/message";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { addNewMessage, setMessages, setSocketConnected, setSocketDisconnected } from "@/store/slices/chatSlice";
import type { FetchAllUsersForChatSidebarResponse } from "@/types/apiTypes/commonApiTypes";

const BASE_URL = "http://localhost:5000";

export const getMessages = createAsyncThunk<Array<Message>, { selectedUserId: string }>('message/getMessages',
    async ({ selectedUserId }, thunkAPI) => {
        const response = await axiosInstance.get(`/message/${selectedUserId}`);
        if (response.data.success) {
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


export const userFetchUsersFroChatSideBar = async () : Promise<FetchAllUsersForChatSidebarResponse> => {
    const response = await axiosInstance.get('/user/chat/admins');
    return response.data.data
}

export const adminFetchUsersFroChatSideBar = async () : Promise<FetchAllUsersForChatSidebarResponse> => {
    const response = await axiosInstance.get('/admin/chat/users');
    return response.data.data
}