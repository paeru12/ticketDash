import api from "./axios";
const route = '/vi4/regions';

export const getRegion = () => {
    return api.get(route);
}

// GET PAGINATION
export const getRegions = ({ page, perPage, search }) => {
  return api.get(route + "/pagination", {
    params: { page, perPage, search },
  });
};

// CREATE
export const createRegion = (formData) => {
  return api.post(route, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// UPDATE
export const updateRegion = (id, formData) => {
  return api.put(`${route}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE
export const deleteRegion = (id) => {
  return api.delete(`${route}/${id}`);
};
