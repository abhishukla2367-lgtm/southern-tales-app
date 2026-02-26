import { useEffect, useState, useRef, useCallback } from "react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService";

const POLL_INTERVAL_MS = 5000; // Refresh every 5 seconds

export default function useMenu() {
  const [menuItems, setMenuItems]   = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const timerRef                    = useRef(null);

  // ─── Fetch & sync categories ──────────────────────────────────────────────
  const fetchMenu = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const { data } = await getMenuItems();
      const menuData = Array.isArray(data) ? data : [];

      setMenuItems(menuData);
      setCategories(["All", ...new Set(menuData.map((i) => i.category).filter(Boolean))]);
      setError(false);
    } catch (err) {
      console.error("Failed to fetch menu:", err.message);
      setError(true);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // ─── Polling: pause when tab hidden, resume on focus ─────────────────────
  const startPolling = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      if (document.visibilityState === "visible") fetchMenu();
    }, POLL_INTERVAL_MS);
  }, [fetchMenu]);

  const stopPolling = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    fetchMenu(true); // Initial load with spinner
    startPolling();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchMenu();   // Immediately re-sync when tab regains focus
        startPolling();
      } else {
        stopPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchMenu, startPolling, stopPolling]);

  // ─── Create or update an item ─────────────────────────────────────────────
  const saveItem = async (formData, editItem) => {
    try {
      if (editItem) {
        const id = editItem._id || editItem.id;
        const { data } = await updateMenuItem(id, formData);
        setMenuItems((prev) =>
          prev.map((i) => (i._id === id || i.id === id ? data : i))
        );
      } else {
        const { data } = await createMenuItem(formData);
        setMenuItems((prev) => [data, ...prev]);
        if (data.category && !categories.includes(data.category)) {
          setCategories((prev) => [...prev, data.category]);
        }
      }
    } catch (err) {
      console.error("Save item error:", err);
      throw err; // Let the modal handle the error display
    }
  };

  // ─── Delete an item ───────────────────────────────────────────────────────
  const removeItem = async (item) => {
    const id = item._id || item.id;
    if (!window.confirm(`Delete "${item.name}"? This will also remove the image from the cloud.`)) return;

    try {
      await deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((i) => i._id !== id && i.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete item.");
    }
  };

  // ─── Restock an item (admin manually adds units) ──────────────────────────
  // Calls PATCH /api/menu/:id/restock  { quantity }
  const restockItem = async (item, quantity) => {
    const id = item._id || item.id;
    try {
      const res = await fetch(`/api/menu/${id}/restock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { item: updated } = await res.json();

      // Immediately reflect new stock in UI without waiting for next poll
      setMenuItems((prev) =>
        prev.map((i) => (i._id === id || i.id === id ? updated : i))
      );
    } catch (err) {
      console.error("Restock failed:", err);
      alert("Failed to restock item.");
    }
  };

  return {
    menuItems,
    categories,
    loading,
    error,
    saveItem,
    removeItem,
    restockItem,  // Use this to manually add stock from admin UI
    refetch: fetchMenu,
    // toggleAvailability removed — status is now auto-derived from stock
  };
}