import React, { useEffect, useState } from 'react';
import { FaVideo, FaMobile } from 'react-icons/fa';
import socket from '../socket';
import {getCompleteTime} from '../helper/utils'

const ChatHeader = ({ name, status, image, chatroomId }) => {

  console.log("user online status::",status)

  const [userActiveDetail, setUserActiveDetail] = useState(null); 

  useEffect(() => {

    socket.on('user_online', ({ roomId, onlineUser }) => {
      if (roomId.toString() === chatroomId.toString()) {
        console.log("socket from backend user is now online::");
        setUserActiveDetail({ status: 'online' })
      }

    });

    socket.on('user_offline', ({ roomId, lastSeen }) => {
      if (roomId.toString() === chatroomId.toString()) {
        console.log("socket from backend user is now offline::");

        setUserActiveDetail({ status: 'offline', lastSeen: getCompleteTime(lastSeen) })
      }
    });

    return () => {
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, []);

  return (
    <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-white">
      <div className="d-flex align-items-center">
        <img src="https://res.cloudinary.com/dlfuxeq5r/image/upload/v1747120473/uploads/ijsl99u4nbdtmfwsof9a.png" className="rounded-circle me-2" alt="User" height={30} />
        <div className='d-flex flex-column'>
          <strong>{name}</strong>
          {userActiveDetail && <span className={`text-${userActiveDetail.status==='online'?'success':'dark'}`} style={{ fontSize: "0.9rem" }}>{userActiveDetail.status==='online'?'online':userActiveDetail.lastSeen}</span>}
        </div>

      </div>
      <div>
        <FaVideo />
        {/* <FaMobile/> */}
      </div>
    </div>
  )
};

export default ChatHeader;