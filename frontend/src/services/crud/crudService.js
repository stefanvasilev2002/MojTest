import api from "../api.jsx";

const crudService = (entity) => ({
    fetchAll: () => {
        console.log(`Fetching all ${entity} items`);
        return api.get(`/${entity}`);
    },
    fetchById: (id) => {
        console.log(`Fetching ${entity} with ID:`, id);  // Log the ID being used
        return api.get(`/${entity}/${id}`);
    },
    create: (data) => {
        console.log(`Creating new ${entity} with data:`, data);  // Log the data being created
        return api.post(`/${entity}`, data);
    },
    update: (id, data) => {
        console.log(`Updating ${entity} with ID: ${id} and data:`, data);  // Log the ID and data
        return api.put(`/${entity}/${id}`, data);
    },
    delete: (id) => {
        console.log(`Deleting ${entity} with ID:`, id);  // Log the ID being deleted
        return api.delete(`/${entity}/${id}`);
    },
});

export default crudService;

