import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReplyMessage,
  resetStatusAndErrors,
  sendMessageInRoom,
} from "../features/chat/ChatSlice";
import { setShowAlert } from "../features/alert/AlertSlice";
import EmojiPicker from "emoji-picker-react";
import { FaFile } from "react-icons/fa";
import { handleFileUploadModal } from "../features/modal/modalSlice";
import FileUploadModal from "./FileUploadModal";

const ChatInput = ({ roomId, sender }) => {
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [user, setUser] = useState({});

  const { sendMessageError, sendMessageStatus, replyMessage } = useSelector(
    (state) => state.chatroom,
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(JSON.parse(userData));
  }, []);

  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);

  const sendMessage = (messageType = "text", file, fileText = "") => {
    const messageBody = {
      message: messageText,
      type: messageType,
      file: file || "",
      fileText: fileText,
      replyTo: replyMessage?._id || null,
    };
    dispatch(sendMessageInRoom({ roomId, messageBody }));
  };

  useEffect(() => {
    if (sendMessageStatus === "success") {
      setMessageText("");
      dispatch(handleFileUploadModal({ isFileModalShow: false }));
      // dispatch(
      //   setShowAlert({
      //     alert: true,
      //     message: "Message sent!",
      //     variant: "success",
      //     duration: 1000,
      //   }),
      // );
      dispatch(clearReplyMessage())
    }

    if (sendMessageStatus === "failed" && sendMessageError) {
      setMessageText("");
      dispatch(handleFileUploadModal({ isFileModalShow: false }));
      dispatch(
        setShowAlert({
          alert: true,
          message: sendMessageError,
          variant: "danger",
          duration: 1000,
        }),
      );
    }

    return () => {
      dispatch(resetStatusAndErrors());
    };
  }, [dispatch, sendMessageStatus, sendMessageError]);

  const handleEmojiClick = (emojiData) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    dispatch(handleFileUploadModal({ isFileModalShow: true }));
  };

  useEffect(()=>{
    return ()=>{
      dispatch(clearReplyMessage())
    }
  },[dispatch])

  return (
    <div className="border-top bg-white p-2">
      {/* 🔥 Reply Preview */}
      {replyMessage && (
        <div
          className="d-flex justify-content-between align-items-center mb-2 p-2"
          style={{
            backgroundColor: "#f0f2f5",
            borderLeft: "4px solid #25D366",
            borderRadius: "6px",
          }}
        >
          <div style={{ maxWidth: "90%" }}>
            <small style={{ fontSize: "12px", color: "#667781" }}>
              Replying to
            </small>

            {/* 👤 Sender Name (optional but recommended) */}
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#25D366",
              }}
            >
              {replyMessage?.sender?._id.toString() === user?._id.toString()
                ? "You"
                : replyMessage?.receiver?.fullName}
            </div>

            {/* 💬 Message Preview */}
            <div
              style={{
                fontSize: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {replyMessage.content || "📎 Attachment"}
            </div>
          </div>

          {/* ❌ Close Button */}
          <button
            className="btn btn-sm"
            style={{ opacity: 0.6 }}
            onClick={() => dispatch(clearReplyMessage())}
          >
            ✖
          </button>
        </div>
      )}

      {/* 🔽 Input Row */}
      <div
        className="d-flex align-items-end position-relative"
        style={{ gap: "8px" }}
      >
        {/* 😀 Emoji */}
        <div style={{ position: "relative" }}>
          <button
            className="btn btn-light"
            onClick={() => setShowPicker(!showPicker)}
          >
            😀
          </button>

          {showPicker && (
            <div
              style={{
                position: "absolute",
                bottom: "45px",
                zIndex: 100,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* 📎 File Upload */}
        <div>
          <label className="btn btn-light m-0">
            <FaFile />
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* 📝 Input */}
        <input
          type="text"
          className="form-control"
          name="messageText"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
          placeholder="Type a message"
        />

        {/* 🚀 Send */}
        <button className="btn btn-primary" onClick={() => sendMessage("text")}>
          Send
        </button>
      </div>

      {/* 📦 File Upload Modal */}
      <FileUploadModal
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatInput;
