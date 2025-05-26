import React, { useEffect, useRef, useState } from 'react';
import { getTime } from '../helper/utils';
import socket from '../socket';
import { inCommingMessage, markMessageSeen } from '../features/chat/ChatSlice'
import { useDispatch } from 'react-redux';



const ChatMessages = ({ singleChatroomDetail }) => {
  const alreadySeenMessages = useRef(new Set());

  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch()

  const messageEndRef = useRef(null);


  useEffect(() => {
    const userData = localStorage.getItem('user');
    setUser(JSON.parse(userData));
  }, []);

  // new message notification
  useEffect(() => {
    const handler = (data) => {
      // console.log("message received::", data);
      if (data.room.toString() === singleChatroomDetail._id.toString()) {
        dispatch(inCommingMessage({ message: data.data }));
      }

    };

    socket.on('message_received', handler);

    return () => {
      socket.off('message_received', handler); // clean up listener
    };
  }, [singleChatroomDetail._id]);

  // receive seen message notify

  useEffect(() => {
    const handler = ({ messageIds }) => {
      console.log("messageIds::", messageIds)
      if (messageIds && messageIds.length > 0) {
        messageIds = messageIds.map(msgId => msgId.toString())
        dispatch(markMessageSeen({ messageIds }))
      }
    };

    socket.on('message_seen_notify', handler);

    return () => {
      socket.off('message_seen_notify', handler); // clean up listener
    };
  }, []);


  useEffect(() => {

    if (messages.length > 0) {
      const unseenMessages = messages.filter(msg => {
        return (
          !msg.seen && msg.sender?._id.toString() !== user.id.toString() &&
          !alreadySeenMessages.current.has(msg._id.toString())
        )
      })

      // console.log("unseenMessages::", unseenMessages.length)

      if (unseenMessages.length > 0) {
        // console.log("start sending message seen socket::", unseenMessages);

        const unreadMessageIds = unseenMessages.map(msg => msg._id);

        unreadMessageIds.forEach(id=>alreadySeenMessages.current.add(id.toString()));

        // console.log("unreadMessageIds::", unreadMessageIds)

        socket.emit('message_seen', {
          roomId: unseenMessages[0].chatRoomId,
          seenBy: user.id,
          unreadMessageIds: unreadMessageIds

        })
      }
    }

  }, [messages, singleChatroomDetail])


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

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



  }, [singleChatroomDetail])


  return (
    <div className="flex-grow-1 p-5 overflow-auto bg-secondary-subtle">
      {messages.map((msg, index) => (
        <div key={index} className={`mb-2 text-${msg.sender?._id.toString() === user.id.toString() ? 'end' : 'start'}`}>
          <div className={`d-inline-block p-2 rounded ${msg.sender?._id.toString() === user.id.toString() ? 'bg-success text-white' : 'bg-white'}`}>
            <div>{msg.content}</div>
            {msg.type === 'image' && <img
              src={msg.file?.url}
              height={100}
              width={200}
            />}
            <small className="d-block text-muted text-end">{getTime(msg.createdAt)}{msg.sender?._id.toString() === user.id.toString() && <span className="tick" style={{ color: `${msg.seen ? 'blue' : 'black'}` }}>&#10003;&#10003;</span>} </small>

          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
}

export default ChatMessages;