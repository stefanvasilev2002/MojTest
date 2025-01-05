import { useEffect, useState, useRef } from "react";

const useMetadataForm = (id, fetchById) => {
    const [metadata, setMetadata] = useState(null);
    const isInitialRender = useRef(true); // Prevents the effect from running on first render

    // Fetch metadata if an id is provided
    useEffect(() => {
        if (id && isInitialRender.current) {
            const fetchMetadata = async () => {
                try {
                    const data = await fetchById(id);
                    setMetadata(data); // Set fetched metadata
                } catch (err) {
                    console.error("Error fetching metadata:", err);
                }
            };
            fetchMetadata();
        }
    }, [id, fetchById]); // Effect runs when 'id' or 'fetchById' changes

    return { metadata }; // Return the metadata state
};

export default useMetadataForm;
