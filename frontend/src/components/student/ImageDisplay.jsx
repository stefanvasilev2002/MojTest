import React, { useState, useEffect } from "react";

const ImageDisplay = ({ imageId }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (imageId) {
            const fetchImage = async () => {
                setLoading(true);
                setError(null);

                try {
                    const url = `${import.meta.env.VITE_API_BASE_URL}/files/download/${imageId}`;
                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error("Image not found");
                    }

                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob); // Create an object URL for the blob
                    setImageUrl(objectUrl);
                    setLoading(false);
                } catch (err) {
                    console.error("Error fetching image:", err);
                    setError("Failed to fetch image.");
                    setLoading(false);
                }
            };

            fetchImage();
        }
    }, [imageId]); // Only run when imageId changes

    if (!imageId) {
        // If imageId does not exist, we hide the component
        return null;
    }

    return (
        <div className="image-container" style={{ display: imageId ? "block" : "none" }}>
            {loading ? (
                <p>Loading image...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <img
                    src={imageUrl}
                    alt="Uploaded"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "150px",
                        border: "1px solid #ccc",
                        objectFit: "cover",
                    }}
                />
            )}
        </div>
    );
};

export default ImageDisplay;
