// src/hooks/crud/useTestQuestion.js
import useCrud from "./useCrud";

const useTestQuestion = () => {
    return useCrud("test-questions");
};

export default useTestQuestion;
