import React, { useState } from 'react';
import ImageUploader from "../components/ImageUploader.jsx";
import { useFormik } from 'formik';

const DebugPage = () => {
    const [uploadedFile, setUploadedFile] = useState(null);

    // Formik setup to handle form state (optional if you want to test Formik integration)
    const formik = useFormik({
        initialValues: {
            image: null,
        },
        onSubmit: (values) => {
            // Log the values when form is submitted
            console.log('Form submitted with image:', values.image);
        },
    });

    // Handler for upload completion
    const handleUploadComplete = (file) => {
        console.log('Uploaded file:', file); // Check uploaded file details

        setUploadedFile(file);

        // Ensure formik.setFieldValue is correctly called
        formik.setFieldValue('image', {
            fileId: file.fileId,
            fileName: file.fileName,
            fileDownloadUri: file.fileDownloadUri,
            fileType: file.fileType,
            size: file.size,
        });

        // Log Formik values after setting them
        console.log('Formik values after upload:', formik.values);
    };


    return (
        <div>
            <h1>Debug ImageUploader</h1>

            <ImageUploader
                label="Upload Image"
                onUploadComplete={handleUploadComplete}
            />

            {/* Display uploaded file info */}
            {uploadedFile && (
                <div>
                    <h3>Uploaded File Details</h3>
                    <pre>{JSON.stringify(uploadedFile, null, 2)}</pre>
                </div>
            )}

            {/* Debugging Formik values */}
            <div>
                <h3>Formik Values:</h3>
                <pre>{JSON.stringify(formik.values, null, 2)}</pre>
            </div>

            {/* Submit button to test Formik integration */}
            <button onClick={formik.handleSubmit}>Submit</button>
        </div>
    );
};
export default DebugPage;
