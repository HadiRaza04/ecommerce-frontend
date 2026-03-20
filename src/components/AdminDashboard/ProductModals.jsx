import React from 'react';
import { X } from 'lucide-react';

export const AddProductModal = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400"><X size={28}/></button>
        <h2 className="text-3xl font-black mb-8 text-slate-800">Add Product</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <input placeholder="Name" required className="w-full bg-slate-50 border-2 rounded-2xl p-4" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input placeholder="Price" required type="number" className="w-full bg-slate-50 border-2 rounded-2xl p-4" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          <textarea placeholder="Description" required className="w-full bg-slate-50 border-2 rounded-2xl p-4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input type="file" multiple onChange={(e) => setFormData({...formData, images: Array.from(e.target.files).slice(0, 5)})} />
          <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest">Confirm & Add</button>
        </form>
      </div>
    </div>
  );
};

export const EditProductModal = ({ product, onClose, onSubmit, formData, setFormData }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400"><X size={28}/></button>
        <h2 className="text-3xl font-black mb-8 text-slate-800">Edit Details</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <input className="w-full bg-slate-50 border-2 rounded-2xl p-4" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="number" className="w-full bg-slate-50 border-2 rounded-2xl p-4" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          <textarea className="w-full bg-slate-50 border-2 rounded-2xl p-4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest">Save Changes</button>
        </form>
      </div>
    </div>
  );
};