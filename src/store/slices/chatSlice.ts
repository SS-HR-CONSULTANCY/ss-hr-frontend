import type { User } from '@/types/entities/user';
import { sendMessage } from '@/utils/apis/chatApi';
import type { Message } from '@/types/entities/message';
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LastMessages = Record<
    string,
    {
        message: string;
        date: string;
    }
>;

type SelectedUser = Pick<User, "_id" | "fullName" | "profileImage"> 


interface chatSliceInitalState {
    onlineUsers: string[] | null;
    lastMessages: LastMessages,
    selectedUser: SelectedUser | null,
    socketId: string | null;
    isConnected: boolean;
    messages: Message[] | null;
    isMessagesLoading: boolean;
}

const intitalState: chatSliceInitalState = {
    onlineUsers: null,
    lastMessages: {},
    selectedUser: null,
    socketId: null,
    isConnected: false,
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
        setSocketConnected: (state,action: PayloadAction<{ socketId: string }>
        ) => {
            state.socketId = action.payload.socketId;
            state.isConnected = true;
        },
        setSocketDisconnected: (state) => {
            state.socketId = null;
            state.isConnected = false;
        },
        clearChatSlice: (state) => {
            state.onlineUsers = null;
            state.lastMessages = {};
            state.selectedUser = null;
            state.socketId = null;
            state.isConnected = false;
            state.messages = null;
            state.isMessagesLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.fulfilled,(state, action) => {
            state.messages?.push(action.payload);
        })
    }
});

export const { 
    setOnlineUsers, 
    setLastMessage, 
    setSelectedUser, 
    setMessages ,
    addNewMessage,
    clearChatSlice,
    setSocketConnected,
    setSocketDisconnected
} = chatSlice.actions;
export default chatSlice.reducer;