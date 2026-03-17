import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { handleFileUploadModal } from "../features/modal/modalSlice";
import axiosInstance from "../api/axiosInstance";

const FileUploadModal = ({ selectedFile, previewUrl, sendMessage }) => {
  const [fileTxt, setFileTxt] = useState("");
  const dispatch = useDispatch();
  const [fileUploadStatus, setFileUploadStatus] = useState("idle");
  const { isFileModalShow } = useSelector((state) => state.modal);

  const handleClose = () => {
    dispatch(
      handleFileUploadModal({
        isFileModalShow: false,
      }),
    );
  };

  const handleSendFile = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      setFileUploadStatus("pending");
      const res = await axiosInstance.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.data && res.data.data._id) {
        const fileType = selectedFile?.type.split("/")[0];
        setFileUploadStatus("completed");
        sendMessage(fileType, res.data.data._id, fileTxt);
        setFileTxt("");
      }
    } catch (error) {
      setFileUploadStatus("idle");
      console.log("error in send image fn::", error);
    }
  };

  return (
    <>
      <Modal show={isFileModalShow} onHide={handleClose} centered>
        <Modal.Body>
          {selectedFile?.type.startsWith("image") && (
            <img src={previewUrl} width="100%" alt="preview" />
          )}
          {selectedFile?.type.startsWith("video") && (
            <video width="100%" controls>
              <source src={previewUrl} type={selectedFile.type} />
            </video>
          )}

          <div className="mt-3 d-flex gap-1">
            <input
              type="text"
              className="form-control"
              name="messageText"
              onChange={(e) => setFileTxt(e.target.value)}
              value={fileTxt}
              placeholder="Type a message"
            />

            <Button
              variant="success"
              className=""
              onClick={handleSendFile}
              disabled={fileUploadStatus === "pending"}
            >
              {fileUploadStatus === "pending" ? "sending..." : "send"}
            </Button>
          </div>
          <Button variant="secondary" className="mt-2" onClick={handleClose}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FileUploadModal;
