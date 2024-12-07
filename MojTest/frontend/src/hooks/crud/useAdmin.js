import useCrud from "./useCrud";

const useAdmin = () => {
    return useCrud("admins");
};

export default useAdmin;
