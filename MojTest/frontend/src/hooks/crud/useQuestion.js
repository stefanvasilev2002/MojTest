// src/hooks/crud/useQuestion.js
import useCrud from "./useCrud";

const useQuestion = () => {
    return useCrud("questions");
};

export default useQuestion;
