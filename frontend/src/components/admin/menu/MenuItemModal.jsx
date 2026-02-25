import { useEffect, useRef, useState } from "react";

const emptyForm = {
  name: "", category: "", price: "", description: "", available: true,
};

export default function MenuItemModal({ editItem, categories, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null); // Store the ACTUAL file here
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (editItem) {
      setForm({
        name:        editItem.name        || "",
        category:    editItem.category    || "",
        price:       editItem.price       || "",
        description: editItem.description || "",
        available:   editItem.available   ?? true,
      });
      setImagePreview(editItem.image || "");
      setImageFile(null); // Reset file input on edit
    } else {
      setForm({ ...emptyForm, category: categories[1] || "" });
      setImagePreview("");
      setImageFile(null);
    }
  }, [editItem, categories]);

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file); // 👈 THIS IS CRUCIAL FOR CLOUDINARY
    
    // Create a local preview URL
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) return;
    
    setSaving(true);
    try {
      // 1. Create FormData to handle the file upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("available", form.available);

      // 2. Add the image file if a new one was selected
      if (imageFile) {
        formData.append("image", imageFile); // 'image' matches upload.single("image") in backend
      }

      // 3. Pass the formData to the parent save function
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Save failed:", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-7 overflow-y-auto max-h-[90vh] shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black text-yellow-400 uppercase tracking-tight">
            {editItem ? "Edit Menu Item" : "Add New Item"}
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 text-xl cursor-pointer transition-colors">✕</button>
        </div>

        {/* Image Upload Area */}
        <div className="mb-6">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">
            Item Image
          </label>

          <div
            className={`h-44 bg-neutral-900 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center mb-3 cursor-pointer transition-all
              ${imagePreview ? "border-neutral-700" : "border-neutral-800 hover:border-yellow-600/50"}`}
            onClick={() => fileRef.current.click()}
          >
            {imagePreview ? (
              <div className="relative w-full h-full group">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full">Change Photo</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-neutral-600">
                <div className="text-4xl mb-2">📸</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Click to Select Image</div>
                <p className="text-[10px] mt-1 text-neutral-700">JPG, PNG or WEBP (Max 5MB)</p>
              </div>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
          
          {imagePreview && (
             <button 
                onClick={() => {setImagePreview(""); setImageFile(null);}} 
                className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-red-400 transition-colors"
             >
                Remove Image
             </button>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
             <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1.5">Dish Name</label>
             <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Butter Chicken"
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-lg px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
             />
          </div>

          <div>
             <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1.5">Price (₹)</label>
             <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-lg px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
             />
          </div>

          <div>
             <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1.5">Category</label>
             <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-lg px-4 py-3 outline-none focus:border-yellow-500 transition-colors"
             >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
             </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Describe this delicious dish..."
            rows={3}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm rounded-lg px-4 py-3 outline-none focus:border-yellow-500 transition-colors resize-none"
          />
        </div>

        {/* Toggle & Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer border-none ${form.available ? "bg-yellow-500" : "bg-neutral-800"}`}
          >
            <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.available ? "left-6" : "left-1"}`} />
          </button>
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">In Stock / Available</span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-transparent hover:bg-neutral-900 text-neutral-500 py-3 text-xs font-black uppercase tracking-widest transition-colors rounded-xl border border-neutral-800">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-[2] rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all
              ${saving ? "bg-neutral-800 text-neutral-600 cursor-wait" : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-900/20"}`}
          >
            {saving ? "Uploading to Cloud..." : editItem ? "Update Item" : "Confirm & Add"}
          </button>
        </div>
      </div>
    </div>
  );
}