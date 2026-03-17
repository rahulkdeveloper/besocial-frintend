import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { handleModalStatus } from "../features/modal/modalSlice";
import { deleteMessage } from "../features/chat/ChatSlice";

function ExampleModal() {
  const { showModal, messageId, isSender, roomId } = useSelector(
    (state) => state.modal,
  );
  const dispatch = useDispatch();

  const handleClose = () => dispatch(handleModalStatus(false));

  const handleDeleteMessage = (type) => {
    dispatch(deleteMessage({ messageId: messageId, roomId, type }));
    dispatch(handleModalStatus(false));
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose} centered>

        <Modal.Body>
          Delete Message?
          <div
            className="container d-flex align-content-end flex-column gap-1 mt-3 py-3"
            style={{
              maxWidth: "50%",
            }}
          >
            {isSender && (
              <Button
                variant="outline-success"
                className="mb-1"
                onClick={() => handleDeleteMessage("everyone")}
              >
                Delete for everyone
              </Button>
            )}
            <Button
              variant="outline-success"
              className="mb-1"
              onClick={() => handleDeleteMessage("for me")}
            >
              Delete for me
            </Button>
            <Button
              variant="outline-success"
              className="mb-1"
              onClick={handleClose}
            >
              cancel
            </Button>
          </div>
        </Modal.Body>

      </Modal>
    </>
  );
}

export default ExampleModal;
