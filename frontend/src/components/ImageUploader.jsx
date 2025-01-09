import React, { useState, useEffect } from "react";
import api from "../services/api.jsx";

const ImageUploader = ({ label, onUploadComplete, initialFile }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageId, setImageId] = useState(null); // Stores the ID of the uploaded image
    const [imageUrl, setImageUrl] = useState(null); // Stores the URL to fetch the image

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        console.debug("File selected:", file);

        if (file) {
            setSelectedFile(file);
            setError(null); // Clear any previous errors
            setUploading(true); // Start uploading
            await handleUpload(file); // Upload the file immediately
        }
    };
    useEffect(() => {
        if (initialFile) {
            console.debug("Initial file found:", initialFile);
            setImageId(initialFile.fileId || initialFile.id);
        }
    }, [initialFile]);

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            setError(null); // Clear any previous errors
            console.debug("Uploading file...");

            const response = await api.post("/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.debug("Upload response:", response.data);
            const uploadedFile = response.data;
            setImageId(uploadedFile.fileId); // Save the file ID for fetching
            setUploading(false); // Stop uploading

            console.log("Uploaded file:", uploadedFile);
            if (onUploadComplete) {
                onUploadComplete(uploadedFile); // Pass uploaded file info back
            }
        } catch (err) {
            console.error("File upload failed:", err);
            setError("Failed to upload file. Please try again.");
            setUploading(false); // Stop uploading even in case of error
        }
    };

    useEffect(() => {
        // Fetch the image from the backend if imageId is set
        if (imageId) {
            console.debug("Fetching image with ID:", imageId);
            const fetchImage = async () => {
                try {
                    const baseUrl = import.meta.env.VITE_API_BASE_URL; // Use the environment variable
                    const imageUrl = `${baseUrl}/files/download/${imageId}`;
                    console.debug("Computed image URL:", imageUrl);
                    setImageUrl(imageUrl); // Store the full URL for the image
                } catch (err) {
                    console.error("Failed to fetch image:", err);
                    setError("Failed to fetch uploaded image. Please try again.");
                }
            };
            fetchImage();
        }
    }, [imageId]);

    return (
        <div className="image-uploader" style={{ display: "flex", alignItems: "center" }}>
            {/* Upload button */}
            <div style={{ marginRight: "1rem" }}>
                <label>{label}</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>

            {/* Display image or upload status */}
            <div className="image-preview" style={{ width: "200px", height: "200px", border: "1px solid #ccc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {uploading ? (
                    <p>Uploading...</p>
                ) : imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                        onError={(e) => {
                            console.error("Error loading image:", imageUrl);
                            e.target.src = ""; // Clear the source in case of an error
                        }}
                    />
                ) : (
                    <p>No image</p>
                )}
            </div>

            {/* Error message */}
            {error && <p className="error" style={{ color: "red", marginLeft: "1rem" }}>{error}</p>}
        </div>
    );
};

export default ImageUploader;
