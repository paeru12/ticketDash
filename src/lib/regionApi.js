import api from "./axios";
const route = '/vi4/regions';

export const getRegions = (params) => {
    return api.get(route, { params });
}

export const createRegion = (data) => {
    return api.post(route, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export const updateRegion = (id, data) => {
    return api.post(`${route}/${id}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export const deleteRegion = (id) => {
    return api.delete(`${route}/${id}`);
}

export const getProvinces = () => {
    return api.get(route + '/province');
}

export const getRegencies = (provinceId) => {
    return api.get(`${route}/district/${provinceId}`);
}