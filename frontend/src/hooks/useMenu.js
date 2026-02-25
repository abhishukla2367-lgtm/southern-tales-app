import { useEffect, useState } from "react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService";

export default function useMenu() {
  const [menuItems, setMenuItems]   = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await getMenuItems();
      // Ensure data is an array
      const menuData = Array.isArray(data) ? data : [];
      setMenuItems(menuData);
      
      const cats = ["All", ...new Set(menuData.map((i) => i.category).filter(Boolean))];
      setCategories(cats);
    } catch (err) {
      console.error("Failed to fetch menu:", err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (formData, editItem) => {
    // formData here is the FormData object created in MenuItemModal
    try {
      if (editItem) {
        const id = editItem._id || editItem.id;
        const { data } = await updateMenuItem(id, formData);
        
        setMenuItems((prev) =>
          prev.map((i) => (i._id === id || i.id === id ? data : i))
        );
      } else {
        const { data } = await createMenuItem(formData);
        setMenuItems((prev) => [data, ...prev]); // Add new item to top
        
        if (!categories.includes(data.category)) {
          setCategories((prev) => [...prev, data.category]);
        }
      }
    } catch (err) {
      console.error("Save item error:", err);
      throw err; // Throw so the modal knows to stay open/show error
    }
  };

  const removeItem = async (item) => {
    const id = item._id || item.id;
    if (!window.confirm(`Delete "${item.name}"? This will also remove the image from the cloud.`)) return;
    
    try {
      await deleteMenuItem(id);
      setMenuItems((prev) =>
        prev.filter((i) => (i._id !== id && i.id !== id))
      );
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete item.");
    }
  };

  const toggleAvailability = async (item) => {
    const id = item._id || item.id;
    try {
      // NOTE: For a simple toggle, we usually send JSON. 
      // If your backend route uses upload.single('image'), 
      // it's better to send a small FormData or update your backend to handle JSON.
      const { data } = await updateMenuItem(id, {
        available: !item.available,
      });

      setMenuItems((prev) =>
        prev.map((i) => (i._id === id || i.id === id ? data : i))
      );
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  return { menuItems, categories, loading, error, saveItem, removeItem, toggleAvailability };
}