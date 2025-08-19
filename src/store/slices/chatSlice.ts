import { Socket } from 'socket.io-client';
import type { User } from '@/types/entities/user';
import type { Message } from '@/types/entities/message';
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LastMessages = Record<
    string,
    {
        message: string;
        date: string;
    }
>;

type SelectedUser = Pick<User, "_id" | "fullName" | "profileImg"> 


interface chatSliceInitalState {
    onlineUsers: string[] | null;
    lastMessages: LastMessages,
    selectedUser: SelectedUser | null,
    chatSocket: Socket | null;
    messages: Message[] | null;
    isMessagesLoading: boolean;
}

const intitalState: chatSliceInitalState = {
    onlineUsers: null,
    lastMessages: {},
    selectedUser: null,
    chatSocket: null,
    messages: null,
    isMessagesLoading: false,
}

const chatSlice = createSlice({
    name: "chatSlice",
    initialState: intitalState,
    reducers: {
        setOnlineUsers: (state, action: PayloadAction<Array<string> | null>) => {
            state.onlineUsers = action.payload;
        },
        setLastMessage: (state, action: PayloadAction<{ userId: string; message: string; date: string }>) => {
            const { userId, message, date } = action.payload;
            state.lastMessages[userId] = { message, date };
        },
        setSelectedUser: (state, action: PayloadAction<SelectedUser | null>) => {
            console.log("action.payload : ",action.payload);
            state.selectedUser = action.payload
        },
        setMessages: (state, action: PayloadAction<Array<Message> | null>) => {
            state.messages = action.payload;
        },
        addNewMessage: (state, action: PayloadAction<Message>) => {
            state.messages?.push(action.payload);
        },
        sendNewMessage: (state, action: PayloadAction<Message>) => {
            state.messages?.push(action.payload);
        }
    },
});

export const { 
    setOnlineUsers, 
    setLastMessage, 
    setSelectedUser, 
    setMessages ,
    addNewMessage,
    sendNewMessage
} = chatSlice.actions;
export default chatSlice.reducer;