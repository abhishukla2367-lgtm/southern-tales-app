import API from "../api/axiosConfig";

// --- PUBLIC: FETCH ALL ITEMS ---
export const getMenuItems = () => API.get("/menu");

// --- ADMIN: CREATE ITEM ---
// Note: 'data' is now a FormData object containing the image file
export const createMenuItem = (data) => 
  API.post("/menu", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// --- ADMIN: UPDATE ITEM ---
// This handles both text updates and new image uploads
export const updateMenuItem = (id, data) => 
  API.put(`/menu/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// --- ADMIN: DELETE ITEM ---
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);