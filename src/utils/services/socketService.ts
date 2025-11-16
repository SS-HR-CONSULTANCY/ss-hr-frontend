import { io, Socket } from "socket.io-client";

export let socket: Socket | null = null;

export const connectSocket = (userId: string, backendUrl: string) => {
  if (!socket) {
    socket = io(backendUrl, { query: { userId }, autoConnect: true });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};
