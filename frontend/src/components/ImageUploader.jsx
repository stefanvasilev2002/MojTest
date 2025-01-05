import React, { useState } from "react";
import api from "../services/api.jsx";

const ImageUploader = ({ label, onUploadComplete }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false); // Track uploading status

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError(null); // Clear any previous errors
            setUploading(true); // Start uploading
            await handleUpload(file); // Upload the file immediately
        }
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            setError(null); // Clear any previous errors
            setUploading(true); // Start uploading

            const response = await api.post("/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const uploadedFile = response.data;
            setUploading(false);
            console.log("Uploaded file:", uploadedFile);

            if (onUploadComplete) {
                onUploadComplete(uploadedFile);
            }
        } catch (err) {
            console.error("File upload failed:", err);
            setError("Failed to upload file. Please try again.");
            setUploading(false); // Stop uploading even in case of error
        }
    };


    return (
        <div className="image-uploader">
            <label>{label}</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
            />

            {/* Show upload status */}
            {uploading && <p>Uploading...</p>}

            {/* Show success or error message */}
            {!uploading && !error && selectedFile && (
                <p>Upload complete: {selectedFile.name}</p>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default ImageUploader;
