import React, { useState, useEffect } from "react";
import { Image, Upload, AlertCircle } from 'lucide-react';
import api from "../services/api.jsx";

const ImageUploader = ({ label, onUploadComplete, initialFile }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageId, setImageId] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (initialFile) {
            console.debug("Initial file found:", initialFile);
            setImageId(initialFile.fileId || initialFile.id);
        }
    }, [initialFile]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        console.debug("File selected:", file);

        if (file) {
            setSelectedFile(file);
            setError(null);
            setUploading(true);
            await handleUpload(file);
        }
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            setError(null);
            console.debug("Uploading file...");

            const response = await api.post("/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.debug("Upload response:", response.data);
            const uploadedFile = response.data;
            setImageId(uploadedFile.fileId);
            setUploading(false);

            if (onUploadComplete) {
                onUploadComplete(uploadedFile);
            }
        } catch (err) {
            console.error("File upload failed:", err);
            setError("Failed to upload file. Please try again.");
            setUploading(false);
        }
    };

    useEffect(() => {
        if (imageId) {
            console.debug("Fetching image with ID:", imageId);
            const fetchImage = async () => {
                try {
                    const baseUrl = import.meta.env.VITE_API_BASE_URL;
                    const imageUrl = `${baseUrl}/files/download/${imageId}`;
                    console.debug("Computed image URL:", imageUrl);
                    setImageUrl(imageUrl);
                } catch (err) {
                    console.error("Failed to fetch image:", err);
                    setError("Failed to fetch uploaded image. Please try again.");
                }
            };
            fetchImage();
        }
    }, [imageId]);

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Upload Section */}
            <div className="w-full sm:w-auto">
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-input"
                        />
                        <label
                            htmlFor="file-input"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image
                        </label>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="flex-1 w-full sm:w-48">
                <div className="relative w-full aspect-square sm:w-48 sm:h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    {uploading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error("Error loading image:", imageUrl);
                                e.target.src = "";
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <Image className="w-8 h-8 mb-2" />
                            <span className="text-sm">No image</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;