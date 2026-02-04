import api from "./axios";
const route = '/vi4/ticket-types';

export const getTicketType = () => {
    return api.get(route);
}

// CREATE
export const createTicketType = (formData) => {
  return api.post(route + "/bulk", formData);
};

// UPDATE
export const updateTicketType = (id, formData) => {
  return api.put(`${route}/${id}`, formData);
};

// DELETE
export const deleteTicketType = (id) => {
  return api.delete(`${route}/${id}`);
};
