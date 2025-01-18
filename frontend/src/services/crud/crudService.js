import api from "../api.jsx";

const crudService = (entity) => ({
    fetchAll: () => {
        return api.get(`/${entity}`);
    },
    fetchById: (id) => {
        return api.get(`/${entity}/${id}`);
    },
    create: (data) => {
        return api.post(`/${entity}`, data);
    },
    update: (id, data) => {
        console.log(`/${entity}/${id}`, data);
        return api.put(`/${entity}/${id}`, data);
    },
    delete: (id) => {
        return api.delete(`/${entity}/${id}`);
    },
});

export default crudService;

