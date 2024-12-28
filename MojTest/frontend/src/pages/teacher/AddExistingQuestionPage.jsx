import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import testQuestionService from "../../services/testQuestionService";
import QuestionList from "../../components/teacher/QuestionList";
import MetadataFilter from "../../components/MetadataFilter.jsx";

const AddExistingQuestionPage = ({ onSelectQuestion }) => {
    const { testId } = useParams();
    const [allQuestions, setAllQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});  // Holds the selected filter options

    // Fetch questions from the server when the component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questions = await testQuestionService.getAllQuestionsNotInTest(testId);
                setAllQuestions(questions);
                setFilteredQuestions(questions);  // Initially, show all questions
                console.log("Fetched Questions:", JSON.stringify(questions, null, 2));
            } catch (err) {
                console.error("Error fetching questions:", err);
            }
        };

        fetchQuestions();
    }, []);

    // Filter questions based on metadata
    const filterQuestions = () => {
        // If no filters are selected, return all questions
        if (Object.keys(filterOptions).every((key) => filterOptions[key].length === 0)) {
            // Filter out questions that are copies (isCopy = true)
            const nonCopyQuestions = allQuestions.filter((question) => !question.isCopy);
            setFilteredQuestions(nonCopyQuestions); // Return only non-copy questions
            return;
        }

        // Filter the questions based on selected filters
        const filtered = allQuestions.filter((question) => {
            let matches = true;

            // Ensure question is not a copy (isCopy = true)
            if (question.isCopy) {
                matches = false; // Skip this question if it's a copy
            }

            // Iterate over each selected filter
            Object.keys(filterOptions).forEach((key) => {
                const selectedValues = filterOptions[key].map((opt) => opt.value); // Selected filter values

                // Ensure metadata exists for the current question
                const questionMetadata = question.metadata || [];

                // Find if the question's metadata contains the selected values
                const hasMatchingMetadata = questionMetadata.some((metadataItem) =>
                    selectedValues.includes(metadataItem.value) && metadataItem.key === key
                );

                // If metadata doesn't match or is missing, exclude the question
                if (selectedValues.length > 0 && !hasMatchingMetadata) {
                    matches = false;
                }
            });

            return matches; // Return true if the question passed all filters
        });

        setFilteredQuestions(filtered); // Update the filtered questions state
    };





    useEffect(() => {
        filterQuestions();
    }, [filterOptions, allQuestions]);  // Re-filter when filters change or when questions are fetched

    // Handle adding a question to the test
    const handleAddToTest = (question) => {
        onSelectQuestion(question);
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">Add Existing Question</h1>

                {/* Metadata Filter */}
                <MetadataFilter
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                />

                {/* Question List */}
                <QuestionList
                    questions={filteredQuestions}  // Pass the filtered list of questions
                    onAddToTest={handleAddToTest}
                />
            </div>
        </div>
    );
};

export default AddExistingQuestionPage;
