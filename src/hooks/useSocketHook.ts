import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Message } from "@/types/entities/message";
import { addNewMessage } from "@/store/slices/chatSlice";
import { getSocket } from "@/utils/services/socketService";

export const useMessage = () => {
  const { selectedUser } = useSelector((store: RootState) => store.chat);
  const dispatch = useDispatch();

  const subscribeToMessages = () => {
    const socket = getSocket();
    if (!selectedUser || !socket) return;

    socket.on("newMessage", (newMessage: Message) => {
      // Only add if the message is from the currently selected user
      if (newMessage.senderId === selectedUser._id) {
        dispatch(addNewMessage(newMessage));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.off("newMessage");
  };

  return { subscribeToMessages, unsubscribeFromMessages };
};
