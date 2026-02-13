import React, { useEffect, useRef, useState } from 'react';
import { getTime, getDateAndTime } from '../helper/utils';
import socket from '../socket';
import { inCommingMessage, markMessageSeen, fetchOlderMessages } from '../features/chat/ChatSlice'
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";


const ChatMessages = ({ singleChatroomDetail }) => {
  const alreadySeenMessages = useRef(new Set());
  const scrollContainerRef = useRef(null);

  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [isLoadingOlder, setLoadingOlder] = useState(false);

  const dispatch = useDispatch()

  const messageEndRef = useRef(null);

  const { currentPage, totalPages } = useSelector(state => state.chatroom.chatroomPagination)

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setUser(JSON.parse(userData));
  }, []);


  useEffect(()=>{

    console.log("send user_active socket to backend::")

    socket.emit('active_chat',{
      targetUserId:singleChatroomDetail.friend?._id,
      roomDetail:{
        userId:singleChatroomDetail.sender?._id,
        roomId:singleChatroomDetail._id
      }
    })
  },[singleChatroomDetail])

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

        unreadMessageIds.forEach(id => alreadySeenMessages.current.add(id.toString()));

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

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingOlder) return;

    if (container.scrollTop === 0 && currentPage < totalPages) {
      setLoadingOlder(true);
      const prevScrollHeight = container.scrollHeight;

      dispatch(fetchOlderMessages({ id: singleChatroomDetail._id, page: currentPage + 1 }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - prevScrollHeight;
          }, 100);
        })
        .finally(() => {
          setLoadingOlder(false);
        })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [isLoadingOlder, currentPage, totalPages]);

  const renderDateSeparator = (prevMsg, currentMsg) => {
    if (!currentMsg?.createdAt) return null;

    const ctMsgDate = moment(currentMsg.createdAt);
    const prevMsgDate = prevMsg ? moment(prevMsg.createdAt) : null;

    if (!prevMsgDate || !ctMsgDate.isSame(prevMsgDate, 'day')) {
      const today = moment();
      const yesterday = moment().subtract(1, 'day');

      let label;
      if (ctMsgDate.isSame(today, 'day')) {
        label = "Today";
      } else if (ctMsgDate.isSame(yesterday, 'day')) {
        label = "Yesterday";
      } else {
        label = ctMsgDate.format('dddd, MMMM D'); // e.g. "Monday, April 22"
      }

      return (
        <div className="text-center my-3">
          <span className="badge bg-light text-dark">{label}</span>
        </div>
      );
    }

    return null;
  };


  return (
    <div className="flex-grow-1 p-5 overflow-auto bg-secondary-subtle"
      ref={scrollContainerRef}
      style={{ height: '100%', overflowY: 'auto' }}
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

            <div className={`mb-2 text-${msg.sender?._id.toString() === user.id.toString() ? 'end' : 'start'}`}>
              <div className={`d-inline-block p-2 rounded ${msg.sender?._id.toString() === user.id.toString() ? 'bg-success text-white' : 'bg-white'}`}>
                <div>{msg.content}</div>
                {msg.type === 'image' && (
                  <img src={msg.file?.url} height={100} width={200} alt="chat-img" />
                )}
                <small className="d-block text-muted text-end">
                  {getTime(msg.createdAt)}
                  {msg.sender?._id.toString() === user.id.toString() && (
                    <span className="tick" style={{ color: msg.seen ? 'blue' : 'black' }}>
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
}

export default ChatMessages;