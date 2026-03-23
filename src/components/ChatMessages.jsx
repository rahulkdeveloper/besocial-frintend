import React, { useEffect, useRef, useState } from "react";
import { getTime, getDateAndTime } from "../helper/utils";
import {
  inCommingMessage,
  markMessageSeen,
  fetchOlderMessages,
  deleteMessage,
  deleteMessageSingleRoom,
  EditMessageSingleRoom,
} from "../features/chat/ChatSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getSocket } from "../socket";
import {
  handleEditMessageModal,
  handleModalStatus,
} from "../features/modal/modalSlice";
import "./ChatMessage.css";
import EditMessageModal from "./EditMessageModal";

const ChatMessages = ({ singleChatroomDetail }) => {
  const alreadySeenMessages = useRef(new Set());
  const scrollContainerRef = useRef(null);
  const socket = getSocket();

  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [isLoadingOlder, setLoadingOlder] = useState(false);
  const [dropdownShow, setDropShow] = useState(false);
  const [hoverMsgId, setHoverMsgId] = useState(null);

  const dispatch = useDispatch();

  const messageEndRef = useRef(null);

  const { currentPage, totalPages } = useSelector(
    (state) => state.chatroom.chatroomPagination,
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(JSON.parse(userData));
  }, []);

  // useEffect(() => {
  //   socket.emit('active_chat', {
  //     targetUserId: singleChatroomDetail.friend?._id,
  //     roomDetail: {
  //       userId: singleChatroomDetail.sender?._id,
  //       roomId: singleChatroomDetail._id
  //     }
  //   })
  // }, [singleChatroomDetail])

  // new message notification
  useEffect(() => {
    if (!socket || !user?._id) return;
    const handler = (data) => {
      if (
        data.room.toString() === singleChatroomDetail._id.toString() &&
        data.receiverId.toString() === user._id.toString()
      ) {
        dispatch(inCommingMessage({ message: data.data }));
      }
    };

    socket.on("message_received", handler);

    return () => {
      socket.off("message_received", handler); // clean up listener
    };
  }, [singleChatroomDetail?._id, user?._id, socket]);

  useEffect(() => {
    if (!socket) return;
    if (!singleChatroomDetail?._id) return;

    socket.emit("chatroom_join", {
      roomId: singleChatroomDetail._id,
    });
  }, [singleChatroomDetail?._id]);

  // receive seen message notify

  useEffect(() => {
    if (!socket || !user?._id) return;
    const handler = ({ messageIds, roomId, seenBy }) => {
      if (
        roomId.toString() === singleChatroomDetail?._id.toString() &&
        seenBy.toString() !== user?._id.toString() &&
        messageIds &&
        messageIds.length > 0
      ) {
        messageIds = messageIds.map((msgId) => msgId.toString());

        dispatch(markMessageSeen({ messageIds }));
      }
    };

    socket.on("message_seen_notify", handler);

    return () => {
      socket.off("message_seen_notify", handler); // clean up listener
    };
  }, [socket, singleChatroomDetail?._id, user?._id]);

  useEffect(() => {
    if (!socket) return;
    const handler = ({ roomId, receiverId, messageId }) => {

      if (
        singleChatroomDetail?._id.toString() === roomId.toString() &&
        receiverId.toString() === user?._id.toString()
      ) {

        dispatch(deleteMessageSingleRoom({ messageId, roomId }));
      }
    };
    socket.on("delete_message", handler);
    return () => {
      socket.off("delete_message", handler);
    };
  }, [socket, singleChatroomDetail?._id, user?._id]);

  useEffect(() => {
    if (!socket) return;
    const handler = ({ roomId, receiverId, messageId,editMessage }) => {
      console.log("received edit_message socket====", {
        roomId,
        receiverId,
        messageId,
        editMessage
      });

      if (
        singleChatroomDetail?._id.toString() === roomId.toString() &&
        receiverId.toString() === user?._id.toString()
      ) {

        dispatch(EditMessageSingleRoom({ messageId, roomId,editMessage }));
      }
    };
    socket.on("edit_message", handler);
    return () => {
      socket.off("edit_message", handler);
    };
  }, [socket, singleChatroomDetail?._id, user?._id]);

  useEffect(() => {
    if (!socket) return;

    if (messages.length > 0) {
      const unseenMessages = messages.filter((msg) => {
        return (
          !msg.seen &&
          msg.sender?._id.toString() !== user?._id.toString() &&
          !alreadySeenMessages.current.has(msg._id.toString())
        );
      });

      if (unseenMessages.length > 0) {
        const unreadMessageIds = unseenMessages.map((msg) => msg._id);

        unreadMessageIds.forEach((id) =>
          alreadySeenMessages.current.add(id.toString()),
        );

        socket.emit("message_seen", {
          roomId: unseenMessages[0].chatRoomId,
          seenBy: user._id,
          unreadMessageIds: unreadMessageIds,
        });
      }
    }
  }, [messages, singleChatroomDetail]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (singleChatroomDetail?.messages.length > 0) {
      let chatMessages = [...singleChatroomDetail.messages]; // create a shallow copy
      chatMessages.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime; // ascending: oldest to newest
      });
      setMessages(chatMessages);
    }
  }, [singleChatroomDetail]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingOlder) return;

    if (container.scrollTop === 0 && currentPage < totalPages) {
      setLoadingOlder(true);
      const prevScrollHeight = container.scrollHeight;

      dispatch(
        fetchOlderMessages({
          id: singleChatroomDetail._id,
          page: currentPage + 1,
        }),
      )
        .unwrap()
        .then(() => {
          setTimeout(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - prevScrollHeight;
          }, 100);
        })
        .finally(() => {
          setLoadingOlder(false);
        });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [isLoadingOlder, currentPage, totalPages]);

  const renderDateSeparator = (prevMsg, currentMsg) => {
    if (!currentMsg?.createdAt) return null;

    const ctMsgDate = moment(currentMsg.createdAt);
    const prevMsgDate = prevMsg ? moment(prevMsg.createdAt) : null;

    if (!prevMsgDate || !ctMsgDate.isSame(prevMsgDate, "day")) {
      const today = moment();
      const yesterday = moment().subtract(1, "day");

      let label;
      if (ctMsgDate.isSame(today, "day")) {
        label = "Today";
      } else if (ctMsgDate.isSame(yesterday, "day")) {
        label = "Yesterday";
      } else {
        label = ctMsgDate.format("dddd, MMMM D"); // e.g. "Monday, April 22"
      }

      return (
        <div className="text-center my-3">
          <span className="badge bg-light text-dark">{label}</span>
        </div>
      );
    }

    return null;
  };

  const handleHover = (id) => {
    // console.log("handle hover====",id);

    setHoverMsgId(id);
  };
  const handleMouseLeave = () => {
    setHoverMsgId(null);
  };

  const handleDeleteMessage = (id, isSender) => {
    // open modal first

    dispatch(
      handleModalStatus({
        show: true,
        messageId: id,
        isSender: isSender,
        roomId: singleChatroomDetail._id,
      }),
    );
  };

  const handleMessageCopy = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (error) {
      console.log("Error in copy", error);
    }
  };

  return (
    <div
      className="flex-grow-1 p-5 overflow-auto bg-secondary-subtle"
      ref={scrollContainerRef}
      style={{ height: "100%", overflowY: "auto" }}
    >
      {isLoadingOlder && (
        <div className="text-center text-muted mb-3">
          <small>Loading earlier messages...</small>
        </div>
      )}

      {messages.map((msg, index) => {
        const prevMsg = messages[index - 1];

        return (
          <React.Fragment key={msg._id || index}>
            {renderDateSeparator(prevMsg, msg)}

            <div
              className={`d-flex mb-2 ${msg.sender?._id?.toString() === user?._id?.toString() ? "justify-content-end" : "justify-contend-start"}`}
              style={{
                // maxWidth:"60%",
                wordBreak: "break-word",
              }}
              onMouseEnter={() => handleHover(msg._id)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`p-2 rounded position-relative ${msg.sender?._id?.toString() === user?._id?.toString() ? "bg-success text-white" : "bg-white"}`}
                style={{
                  minWidth: "80px",
                  maxWidth: "60%",
                  wordBreak: "break-word",
                }}
              >
                {/* Dropdown */}
                {!msg.isDeleted &&
                  msg._id.toString() === hoverMsgId?.toString() && (
                    <div className="position-absolute top-0 end-0 dropdown">
                      <button
                        className="btn btn-sm text-dark"
                        data-bs-toggle="dropdown"
                      >
                        ⋮
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button className="dropdown-item">Reply</button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              handleDeleteMessage(
                                msg._id,
                                msg.sender?._id?.toString() ===
                                  user?._id?.toString(),
                              )
                            }
                          >
                            Delete
                          </button>
                        </li>
                        {msg.sender?._id?.toString() ===
                          user?._id?.toString() && (
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                dispatch(
                                  handleEditMessageModal({
                                    isShow: true,
                                    message: msg,
                                  }),
                                )
                              }
                            >
                              Edit
                            </button>
                          </li>
                        )}

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleMessageCopy(msg)}
                          >
                            Copy
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                {/* <div>{msg.isDeleted ? "Message deleted" : msg.content}</div>

                {msg.type === "image" && (
                  <img
                    src={msg.file?.url}
                    height={100}
                    width={200}
                    alt="chat-img"
                  />
                )}

                {msg.type === "video" && (
                  <video>
                    <source src={SiMg.file?.url} type={msg.type} />
                  </video>
                )} */}

                {msg.isDeleted ? (
                  <div>Message deleted</div>
                ) : (
                  <>
                    {msg.type === "text" && <div>{msg.content}</div>}

                    {msg.type === "image" && (
                      <div className="chat-image-msg">
                        <img
                          src={msg.file?.url}
                          height={100}
                          width={200}
                          alt="chat-img"
                          className="chat-image rounded"
                          onClick={() => window.open(msg.file?.url)}
                        />
                        {msg.fileText && (
                          <p className="chat-image-caption">{msg.fileText}</p>
                        )}
                      </div>
                    )}

                    {msg.type === "video" && (
                      <div>
                        <video height={120} controls>
                          <source src={msg.file?.url} type="video/mp4" />
                        </video>
                        {msg.fileText && <p>{msg.fileText}</p>}
                      </div>
                    )}
                  </>
                )}

                <small className="d-flex justify-content-end text-muted gap-1"
                >
                  {msg.isEdited && <span>isEdited</span>}
                  {getTime(msg.createdAt)}
                  {msg.sender?._id?.toString() === user?._id?.toString() && (
                    <span
                      className="tick"
                      style={{ color: msg.seen ? "blue" : "black" }}
                    >
                      &#10003;&#10003;
                    </span>
                  )}
                </small>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatMessages;
