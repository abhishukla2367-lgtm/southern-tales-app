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
      setMenuItems(data);
      const cats = ["All", ...new Set(data.map((i) => i.category).filter(Boolean))];
      setCategories(cats);
    } catch (err) {
      console.error("Failed to fetch menu:", err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (form, editItem) => {
    if (editItem) {
      const { data } = await updateMenuItem(editItem._id || editItem.id, form);
      setMenuItems((prev) =>
        prev.map((i) => (i._id === data._id || i.id === data.id ? data : i))
      );
    } else {
      const { data } = await createMenuItem(form);
      setMenuItems((prev) => [...prev, data]);
      if (!categories.includes(data.category)) {
        setCategories((prev) => [...prev, data.category]);
      }
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    await deleteMenuItem(item._id || item.id);
    setMenuItems((prev) =>
      prev.filter((i) => (i._id || i.id) !== (item._id || item.id))
    );
  };

  const toggleAvailability = async (item) => {
    const { data } = await updateMenuItem(item._id || item.id, {
      ...item,
      available: !item.available,
    });
    setMenuItems((prev) =>
      prev.map((i) => (i._id === data._id || i.id === data.id ? data : i))
    );
  };

  return { menuItems, categories, loading, error, saveItem, removeItem, toggleAvailability };
}