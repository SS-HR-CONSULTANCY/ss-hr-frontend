import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Message } from "@/types/entities/message";
import { addNewMessage } from "@/store/slices/chatSlice";

export const useMessage = () => {

  const { selectedUser, chatSocket } = useSelector((store: RootState) => store.chat);
  const dispatch = useDispatch();

  const subscribeToMessages = () => {
    if (!selectedUser || !chatSocket) return;

    chatSocket.on("newMessage", (newMessage: Message) => {
      if (newMessage.senderId !== selectedUser._id) return;

      dispatch(addNewMessage(newMessage));
    });
  };

  const unsubscribeFromMessages = () => {
    if (!chatSocket) return;
    chatSocket.off("newMessage");
  };

  return { subscribeToMessages, unsubscribeFromMessages };
};
