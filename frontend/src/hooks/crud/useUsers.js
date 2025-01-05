import useCrud from "./useCrud";

const useUsers = () => {
    return useCrud("users");
};

export default useUsers;
