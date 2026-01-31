import api from "./axios";
const route = '/vi4/creators';

export const getCreator = () => {
    return api.get(route);
}

export const getCreatorPagination = ({ page, perPage, search }) => {
  return api.get(route + "/pagination", {
    params: { page, perPage, search },
  });
};

// CREATE
export const createCreator = (formData) => {
  return api.post(route, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
};

// UPDATE
export const updateCreator = (id, formData) => {
  return api.put(`${route}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
};

// DELETE (nanti dipakai)
export const deleteCreator = (id) => {
  return api.delete(`${route}/${id}`);
};
