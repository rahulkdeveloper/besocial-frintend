import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetStatusAndErrors, sendMessageInRoom } from '../features/chat/ChatSlice';
import { setShowAlert } from "../features/alert/AlertSlice";
import EmojiPicker from 'emoji-picker-react';
import { FaFile } from 'react-icons/fa'
import axiosInstance from '../api/axiosInstance';

const ChatInput = ({ roomId, sender }) => {
  console.log("roomdId in send message input box::", roomId)
  const [messageText, setMessageText] = useState("");

  const { sendMessageError, sendMessageStatus } = useSelector(state => state.chatroom);
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);

  const sendMessage = (messageType = 'text', file, fileText = '') => {
    const messageBody = {
      message: messageText,
      type: messageType,
      file: file || '',
      fileText: fileText
    }

    dispatch(sendMessageInRoom({ roomId, messageBody }))

  }

  useEffect(() => {

    if (sendMessageStatus === 'success') {
      console.log("showing alert now::")
      setMessageText("")
      dispatch(setShowAlert({ alert: true, message: "Message sent!", variant: 'success', duration: 1000 }));
    }

    if (sendMessageStatus === 'failed' && sendMessageError) {
      setMessageText("")
      dispatch(setShowAlert({ alert: true, message: sendMessageError, variant: 'danger', duration: 1000 }));
    }

    return () => {
      dispatch(resetStatusAndErrors())
    }

  }, [dispatch, sendMessageStatus, sendMessageError]);

  const handleEmojiClick = (emojiData) => {
    setMessageText(prev => prev + emojiData.emoji)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    console.log("file selected::", file)

    if (!file) return;
    const formData = new FormData();
    const fileType = file.type.split('/')[0]
    formData.append('file', file);
    try {
      const res = await axiosInstance.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("res from file upload::", res.data);

      if (res.data?.data && res.data.data._id) {
        sendMessage(fileType, res.data.data._id, '')
      }

    } catch (error) {
      console.log('error in send image fn::', error);

    }
  }

  return (
    <div className="p-2 border-top bg-white d-flex align-items-end position-relative" style={{ gap: "8px" }}>

      {/* Emoji Button + Picker */}
      <div style={{ position: "relative" }}>
        <button className="btn btn-light" onClick={() => setShowPicker(!showPicker)}>😀</button>

        {showPicker && (
          <div style={{
            position: "absolute",
            bottom: "40px", // adjust to show above
            zIndex: 100,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>


      <div style={{ position: 'relative' }}>
        <label className='btn btn-light m-0'>
          <FaFile />
          <input
            type='file'
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>

      </div>


      {/* Input Field */}
      <input
        type="text"
        className="form-control"
        name="messageText"
        onChange={(e) => setMessageText(e.target.value)}
        value={messageText}
        placeholder="Type a message"
      />

      {/* Send Button */}
      <button className="btn btn-primary" onClick={() => sendMessage('text')}>
        Send
      </button>
    </div>

  )
}

export default ChatInput;