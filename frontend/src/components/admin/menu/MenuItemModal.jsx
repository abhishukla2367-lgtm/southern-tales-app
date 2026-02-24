import { useEffect, useRef, useState } from "react";

const emptyForm = {
  name: "", category: "", price: "", description: "", image: "", available: true,
};

export default function MenuItemModal({ editItem, categories, onSave, onClose }) {
  const [form, setForm]               = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving]           = useState(false);
  const fileRef                       = useRef();

  useEffect(() => {
    if (editItem) {
      setForm({
        name:        editItem.name        || "",
        category:    editItem.category    || "",
        price:       editItem.price       || "",
        description: editItem.description || "",
        image:       editItem.image       || "",
        available:   editItem.available   ?? true,
      });
      setImagePreview(editItem.image || "");
    } else {
      setForm({ ...emptyForm, category: categories[1] || "" });
      setImagePreview("");
    }
  }, [editItem]);

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setForm((f) => ({ ...f, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrl = (url) => {
    setForm((f) => ({ ...f, image: url }));
    setImagePreview(url);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error("Save failed:", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-7 overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black text-yellow-400">
            {editItem ? "Edit Item" : "Add New Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 text-xl bg-transparent border-none cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Image Upload */}
        <div className="mb-5">
          <label className="block text-xs font-black uppercase tracking-widest text-neutral-600 mb-2">
            Item Image
          </label>

          <div
            className="h-36 bg-neutral-900 border-2 border-dashed border-neutral-800 rounded-xl overflow-hidden flex items-center justify-center mb-3 cursor-pointer hover:border-neutral-600 transition-colors"
            onClick={() => fileRef.current.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <div className="text-center text-neutral-600">
                <div className="text-4xl">📷</div>
                <div className="text-xs mt-1">Click to upload</div>
              </div>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />

          <input
            value={form.image}
            onChange={(e) => handleImageUrl(e.target.value)}
            placeholder="Or paste image URL..."
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 placeholder-neutral-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-yellow-500 transition-colors"
          />
        </div>

        {/* Text Fields */}
        {[
          { key: "name",        label: "Item Name",   type: "text",     placeholder: "e.g. Paneer Tikka" },
          { key: "price",       label: "Price (₹)",   type: "number",   placeholder: "e.g. 199" },
          { key: "category",    label: "Category",    type: "text",     placeholder: "e.g. Starters" },
          { key: "description", label: "Description", type: "textarea", placeholder: "Short description..." },
        ].map((f) => (
          <div key={f.key} className="mb-4">
            <label className="block text-xs font-black uppercase tracking-widest text-neutral-600 mb-1.5">
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea
                value={form[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                rows={3}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-yellow-500 transition-colors resize-none"
              />
            ) : (
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-600 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-yellow-500 transition-colors"
              />
            )}
          </div>
        ))}

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer border-none
              ${form.available ? "bg-yellow-400" : "bg-neutral-700"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                ${form.available ? "left-6" : "left-1"}`}
            />
          </button>
          <span className="text-sm text-neutral-400">Available for ordering</span>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-500 rounded-xl py-3 text-sm font-bold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-[2] rounded-xl py-3 text-sm font-black border-none transition-all
              ${saving
                ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black cursor-pointer hover:shadow-lg hover:shadow-yellow-900/40"
              }`}
          >
            {saving ? "Saving..." : editItem ? "Save Changes" : "Add to Menu"}
          </button>
        </div>
      </div>
    </div>
  );
}