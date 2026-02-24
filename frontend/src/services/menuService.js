import API from "../api/axiosConfig";

export const getMenuItems    = ()         => API.get("/menu");
export const createMenuItem  = (data)     => API.post("/menu", data);
export const updateMenuItem  = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem  = (id)       => API.delete(`/menu/${id}`);