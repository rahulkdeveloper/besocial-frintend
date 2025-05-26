import React, { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleChatroom, resetChatroomDetail } from '../features/chat/ChatSlice'

const ChatWindow = ({ roomId = 1, chatType }) => {

  const dispatch = useDispatch();

  const { singleChatroomDetail, chatroomId, chatroomPagination, fetchSingleChatroomStatus } = useSelector(state => state.chatroom);

  if (chatroomId) {
    console.log(true)
  }

  useEffect(() => {
    return () => {
      dispatch(resetChatroomDetail())
    }
  }, [])

  useEffect(() => {
    if (roomId) {
      console.log("Dispatching fetchSingleChatroom with roomId:", roomId);
      dispatch(fetchSingleChatroom({ id: roomId, chatType }));
    };

  }, [roomId, dispatch]);

  // Show loading if data isn't available or fetch is in progress
  if (fetchSingleChatroomStatus === 'loading' || !singleChatroomDetail) {
    return <div className="text-center mt-5">Loading chat...</div>;
  }

  return (
    <div className="flex-grow-1 d-flex flex-column">
      <ChatHeader
        name={chatType === 'single' ? singleChatroomDetail.friend?.fullName : singleChatroomDetail.name}
        image={chatType === 'single' ? singleChatroomDetail.friend?.profileImage : singleChatroomDetail.groupImage
        }
        status={chatType === 'single' ? singleChatroomDetail.friend?.status : ''}
      />
      <ChatMessages
        singleChatroomDetail={singleChatroomDetail}
      />
      <ChatInput
        roomId={singleChatroomDetail._id}
        sender={singleChatroomDetail.sender}
      />
    </div>
  );
};

export default ChatWindow;