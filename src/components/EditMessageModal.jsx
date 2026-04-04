import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { handleEditMessageModal } from "../features/modal/modalSlice";
import axiosInstance from "../api/axiosInstance";
import { editMessage } from "../features/chat/ChatSlice";
import EmojiPickr from "./EmojiPickr";

const EditMessageModal = () => {
  const [msgText, setMessageText] = useState("");
  const dispatch = useDispatch();

  const { editMessageModalShow, selectedMessage } = useSelector(
    (state) => state.modal,
  );
  const { editMessageStatus, editMessageError } = useSelector(
    (state) => state.chatroom,
  );

  const handleSelectedEmoji = (emojiData) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    if (selectedMessage) {
      setMessageText(
        selectedMessage.type === "text"
          ? selectedMessage.content
          : selectedMessage.fileText,
      );
    }
  }, [selectedMessage?._id]);

  const handleClose = () => {
    dispatch(
      handleEditMessageModal({
        isShow: false,
      }),
    );
  };

  const handleEditMessage = () => {
    dispatch(
      editMessage({
        messageId: selectedMessage._id,
        roomId: selectedMessage.chatRoomId,
        data: {
          type: selectedMessage.type,
          message: msgText,
        },
      }),
    );
  };

  useEffect(() => {
    if (editMessageStatus === "success") {
      dispatch(handleEditMessageModal({ editMessageModalShow: false }));
    } else if (editMessageStatus === "failed") {
      dispatch(
        setShowAlert({
          alert: true,
          message: editMessageError.message || "Edit Message failed.",
          variant: "danger",
          duration: 1000,
        }),
      );
    }
  }, [dispatch, editMessageStatus]);

  return (
    <Modal show={editMessageModalShow} onHide={handleClose} centered>
      <Modal.Body>
        {!selectedMessage ? (
          <p>Loading...</p>
        ) : (
          <>
            {selectedMessage.type === "image" && (
              <img src={selectedMessage.file?.url} width="100%" alt="preview" />
            )}
            {selectedMessage.type === "video" && (
              <video width="100%" controls>
                <source src={selectedMessage.file?.url} type="video/mp4" />
              </video>
            )}

            <div className="mt-3 d-flex gap-1">
              <input
                type="text"
                className="form-control"
                value={msgText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <EmojiPickr handleSelectedEmoji={handleSelectedEmoji} />
              <Button onClick={handleEditMessage}>Edit</Button>
            </div>
          </>
        )}

        <Button variant="secondary" className="mt-2" onClick={handleClose}>
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default EditMessageModal;
