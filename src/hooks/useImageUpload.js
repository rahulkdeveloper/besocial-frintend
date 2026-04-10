import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useImageUpload = () => {
  const [preview, setPreview] = useState(null);
  const [uploadedId, setUploadedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/upload/single",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadedId(res.data.data._id);
    } catch (err) {
      setError(err);
      console.log("Upload error", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    preview,
    uploadedId,
    loading,
    error,
    handleImageChange,
  };
};

export default useImageUpload;