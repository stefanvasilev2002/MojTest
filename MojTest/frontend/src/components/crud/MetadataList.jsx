import React from "react";
import { useNavigate } from "react-router-dom";
import useMetadata from "../../hooks/crud/useMetadata.js";
import Alert from "../Alert.jsx";
import CrudActionTable from "../CrudActionTable.jsx";

const MetadataList = () => {
    const { items: metadataList, loading, error, remove } = useMetadata(); // Fetch metadata and remove method
    const navigate = useNavigate();

    console.log("Metadata List:", JSON.stringify(metadataList, null, 2));  // Pretty-print the list

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this metadata?")) {
            console.log("Deleting item with ID:", id);  // Log the ID here
            await remove(id); // Call the remove method from the hook
        }
    };


    if (loading) {
        return (
            <div>
                <h1>Metadata List</h1>
                <p>Loading metadata...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the metadata." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Metadata List</h1>
            <button
                onClick={() => navigate("/crud/metadata/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Metadata
            </button>
            {metadataList.length === 0 ? (
                <p>No metadata found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Key", "Value"]}
                    rows={metadataList.map((item) => [
                        item.id,
                        item.key,
                        item.value,
                    ])}
                    onEdit={(id) => navigate(`/crud/metadata/edit/${id}`)}  // Pass the ID directly
                    onDelete={(id) => handleDelete(id)}  // Pass the ID directly

                />
            )}
        </div>
    );
};

export default MetadataList;
