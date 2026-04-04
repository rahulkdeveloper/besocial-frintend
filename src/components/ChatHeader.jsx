import React, { useEffect, useState } from 'react';
import { FaVideo, FaMobile } from 'react-icons/fa';
import { getCompleteTime } from '../helper/utils'
import { getSocket } from '../socket/socket';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ name, status, image, chatroomId }) => {
  const socket = getSocket();
  const navigate = useNavigate()

  const [userActiveDetail, setUserActiveDetail] = useState({ status: status });
  const {singleChatroomDetail} = useSelector(state=>state.chatroom);

  useEffect(() => {

    if (!socket) return;

    socket.on('user_online', ({ roomId, userId }) => {
      if (!roomId) return
      if (roomId.toString() === chatroomId.toString()) {
        setUserActiveDetail({ status: 'online' })
      }

    });

    socket.on('user_offline', ({ roomId, lastSeen }) => {
      if (!roomId) return
      if (roomId.toString() === chatroomId.toString()) {
        setUserActiveDetail({ status: 'offline', lastSeen: getCompleteTime(lastSeen) })
      }
    });

    return () => {
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [socket, chatroomId]);

  return (
    <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-white">
      <div className="d-flex align-items-center">
        <img src="https://res.cloudinary.com/dlfuxeq5r/image/upload/v1747120473/uploads/ijsl99u4nbdtmfwsof9a.png" className="rounded-circle me-2" alt="User" height={30} />
        <div className='d-flex flex-column'>
          <strong>{name}</strong>
          {userActiveDetail && <span className={`text-${userActiveDetail.status === 'online' ? 'success' : 'dark'}`} style={{ fontSize: "0.9rem" }}>{userActiveDetail.status === 'online' ? 'online' : getCompleteTime(singleChatroomDetail?.friend?.lastSeen)}</span>}
        </div>

      </div>
      <div>
        <FaVideo onClick={()=> navigate("/video/123")} />
        {/* <FaMobile/> */}
      </div>
    </div>
  )
};

export default ChatHeader;