import React from 'react';

const ChatHeader = ({name,status,image}) => {

  return (
    <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-white">
      <div className="d-flex align-items-center">
        <img src="https://res.cloudinary.com/dlfuxeq5r/image/upload/v1747120473/uploads/ijsl99u4nbdtmfwsof9a.png" className="rounded-circle me-2" alt="User" height={30} />
        <strong>{name}</strong>
      </div>
      <div>
        <i className="bi bi-telephone me-3"></i>
        <i className="bi bi-camera-video"></i>
      </div>
    </div>
  )
};

export default ChatHeader;