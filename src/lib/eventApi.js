import api from "./axios";
const route = "/vi4/events";

export const getEvents = async ({ page, perPage, search }) => {
  const res = await api.get(route + "/pagination", {
    params: { page, perPage, search },
  });

  return {
    events: res.data.data ?? [],
    meta: res.data.meta ?? null,
    media: res.data.media,
  };
};

export const getEvent = async (id) => {
  const res = await api.get(`${route}/${id}`);
  return res.data;
};


// CREATE
export const createEvents = (formData) => {
  return api.post(route + "/create-all", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
};

// UPDATE
export const updateEvents = (id, formData) => {
  return api.put(`${route}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
};

// DELETE (nanti dipakai)
export const deleteEvents = (id) => {
  return api.delete(`${route}/${id}`);
};
