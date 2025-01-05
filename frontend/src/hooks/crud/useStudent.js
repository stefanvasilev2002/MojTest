import useCrud from "./useCrud";

const useStudent = () => {
    return useCrud("students");
};

export default useStudent;
