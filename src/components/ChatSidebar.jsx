import React, { useEffect, useState } from "react";
import { Image, Badge } from "react-bootstrap";
import { filterChatrooms, getDateAndTime, textShorter } from "../helper/utils";
import { constant } from "../config/config";
import { FaCross, FaImage } from "react-icons/fa";
import { EditMessageSingleRoom, fetchChatrooms, startChat } from "../features/chat/ChatSlice";
import { useDispatch, useSelector } from "react-redux";
import { unReadIncomingMessage } from "../features/chat/ChatSlice";
import { getSocket } from "../socket/socket";
import {} from "react-icons/fa";

const ChatSidebar = ({ allChatrooms }) => {
  const [search, setSearch] = useState("");
  const socket = getSocket();
  const [chatrooms, setChatrooms] = useState(allChatrooms);

  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(JSON.parse(userData));
  }, []);

  const chatStart = (roomId, type) => {
    dispatch(startChat({ id: roomId, type }));
  };

  const { singleChatroomDetail, chatroomId } = useSelector(
    (state) => state.chatroom,
  );

  // useEffect(() => {
  //   if (!socket || !user?._id) return;
  //   const handler = (data) => {
  //     if (
  //       data.receiverId.toString() === user?._id.toString() &&
  //       data.room.toString() !== singleChatroomDetail?._id.toString()
  //     ) {
  //       dispatch(unReadIncomingMessage({ message: data.data, type: "unread" }));
  //     }
  //   };

  //   socket.on("unread_messages", handler);

  //   return () => {
  //     socket.off("unread_messages", handler); // clean up listener
  //   };
  // }, [socket, user?._id, singleChatroomDetail?._id]);

  useEffect(() => {
    if (!socket) return;
    const handler = ({ roomId, receiverId, messageId, editMessage }) => {
      console.log("received edit_message socket in sidebar====", {
        roomId,
        receiverId,
        messageId,
        editMessage,
      });

      if (
        receiverId.toString() === user?._id.toString() &&
        (!singleChatroomDetail ||
          singleChatroomDetail?._id.toString() !== roomId.toString())
      ) {
        dispatch(EditMessageSingleRoom({ messageId, roomId, editMessage }));
      }
    };
    socket.on("edit_message", handler);
    return () => {
      socket.off("edit_message", handler);
    };
  }, [socket, singleChatroomDetail?._id, user?._id]);

 useEffect(() => {

  if (allChatrooms) {
    const filteredchats = filterChatrooms(allChatrooms, search);

    setChatrooms(filteredchats);
  }
}, [search, allChatrooms]);

useEffect(()=>{
  const debounce = setTimeout(() => {
    if(search.trim()){
      dispatch(fetchChatrooms({search:search}))
    }
    else {
      dispatch(fetchChatrooms({search:""}))
    }
  }, 400);
  return ()=> clearTimeout(debounce)
},[search])

  return (
    <div className="chat-sidebar bg-light border-end p-2">
      <h5 className="ps-2">Chats</h5>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="form-control my-2 pe-5"
          placeholder="Search or start new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <span
            onClick={() => setSearch("")}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ❌
          </span>
        )}
      </div>
      <div className="chat-list">
        {chatrooms.map((room) => (
          <div
            key={room._id}
            className="chat-user d-flex justify-content-between align-items-center p-2 border-bottom"
            onClick={() => chatStart(room._id, room.chatType)}
          >
            <div className="d-flex align-items-center">
              <div>
                <Image
                  src={room.friend?.profileImage?.url || constant.userIcon}
                  roundedCircle
                  height={40}
                  width={40}
                  alt="Profile"
                />
              </div>
              <div className="mx-2 flex-grow-1">
                {room.chatType === "single" && (
                  <strong>
                    {room.friend?.fullName || room.friend?.username}
                  </strong>
                )}
                {room.chatType === "group" && <strong>{room.name}</strong>}

                <div className="text-muted small">
                  {room.currentMessage?.isDeleted ? (
                    "Message deleted"
                  ) : room.currentMessage?.type === "text" &&
                    room.currentMessage?.content ? (
                    textShorter(room.currentMessage.content)
                  ) : room.currentMessage?.type ? (
                    <>
                      <FaImage className="mx-1" />
                      Image
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="text-muted small text-nowrap ms-2">
              {room.currentMessage?.createdAt &&
                getDateAndTime(room.currentMessage.createdAt)}
              {room.unreadMessageCount > 0 && (
                <Badge className="mx-1">{room.unreadMessageCount}</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
