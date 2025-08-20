import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/components/lib/axios";
import type { Message } from "@/types/entities/message";
import type { ApiBaseResponse } from "@/types/commonTypes";
import { sendNewMessage, setMessages } from "@/store/slices/chatSlice";
import type { AdminfetchAllUsersForChatSidebarResponse } from "@/types/apiTypes/admin";

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

export const sendMessage = createAsyncThunk<ApiBaseResponse,{ selectedUserId: string, messageData: FormData}>('messages/sendMessage',
    async ({ selectedUserId, messageData }, thunkAPI) => {
        const response = await axiosInstance.post(`/message/send/${selectedUserId}`, messageData);
        if (response.data.success) {
            const messages: Message = response.data.data;
            thunkAPI.dispatch(sendNewMessage(messages));
        }
        return thunkAPI.rejectWithValue("Failed to send message");
    }
)

export const adminFetchUsersFroChatSideBar = async () : Promise<AdminfetchAllUsersForChatSidebarResponse> => {
    const response = await axiosInstance.get('/chat/getUsersForCahtSidebar');
    return response.data.data
}