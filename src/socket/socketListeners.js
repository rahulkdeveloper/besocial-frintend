import { getSocket } from "./socket";
import { store } from "../app/store"
import {
  inCommingMessage,
  EditMessageSingleRoom,
  deleteMessageSingleRoom,
  markMessageSeen,
  unReadIncomingMessage
} from "../features/chat/ChatSlice";

export const initSocketListeners = (userId) => {
  const socket = getSocket();

  if (!socket) return;

  // ✅ New message
  socket.on("message_received", (data) => {
    console.log("message_received socket recived===>",data);
    
    if (
      data.receiverId.toString() === userId.toString()
    ) {
      store.dispatch(inCommingMessage({ message: data.data, roomId: data.room }));
    }
  });

  // ✅ Edit message
  socket.on("edit_message", (data) => {
    store.dispatch(EditMessageSingleRoom(data));
  });

  // ✅ Delete message
  socket.on("delete_message", (data) => {
    store.dispatch(deleteMessageSingleRoom(data));
  });

  // ✅ Seen
  socket.on("message_seen_notify", ({ messageIds, roomId, seenBy }) => {
    console.log("message_seen_notify===");

    if (
      seenBy.toString() !== userId.toString() &&
      messageIds &&
      messageIds.length > 0
    ) {
      const formattedIds = messageIds.map((msgId) => msgId.toString());

      store.dispatch(
        markMessageSeen({
          messageIds: formattedIds,
          roomId,
        })
      );
    }
  });

}