import React, { useState, useEffect } from 'react';

const QuestionImageDisplay = ({ fileId, className = '' }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            if (!fileId) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files/download/${fileId}`);

                if (!response.ok) {
                    throw new Error(`Failed to load image (Status: ${response.status})`);
                }

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            } catch (err) {
                console.error('Error loading image:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [fileId]);

    if (!fileId) return null;

    return (
        <div className={`question-image-container ${className}`}>
            {loading && (
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
                    <div className="text-gray-500">Loading image...</div>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center h-48 bg-red-50 rounded">
                    <div className="text-red-500 text-sm">{error}</div>
                </div>
            )}

            {!loading && !error && imageUrl && (
                <img
                    src={imageUrl}
                    alt="Question"
                    className="max-w-full h-auto rounded shadow-sm"
                />
            )}
        </div>
    );
};

export default QuestionImageDisplay;