import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, ShoppingCart, Edit, Trash2, RefreshCcw, 
  Loader2, X, Calendar, Menu, Plus 
} from 'lucide-react';
import baseURL from '../constraints';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [newProduct, setNewProduct] = useState({
  name: '',
  description: '',
  price: '',
  images: []
});



const handleAddProduct = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('name', newProduct.name);
  formData.append('description', newProduct.description);
  formData.append('price', newProduct.price);
  
  newProduct.images.forEach((image) => {
    formData.append('image', image); 
  });

  try {
    const response = await axios.post(
      `${baseURL}/products/addProduct`, 
      formData, 
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      }
    );

    if (response.data) {
      alert("Product added successfully!");
      setProducts([...products, response.data.data || response.data]); // Update UI
      setIsAddModalOpen(false); // Close modal
      setNewProduct({ name: '', description: '', price: '', images: [] }); // Reset form
    }
  } catch (error) {
    console.error("Add Product Error:", error);
    alert("Failed to add product. Check console for details.");
  }
};

  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: '', description: '' });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        axios.get(`${baseURL}/products`, config),
        axios.get(`${baseURL}/orders`, config)
      ]);
      setProducts(prodRes.data.data || prodRes.data);
      setOrders(orderRes.data.data || orderRes.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${baseURL}/products/deleteProduct/${id}`, config);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) { alert("Delete failed"); }
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product._id);
    setEditFormData({ name: product.name, price: product.price, description: product.description || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${baseURL}/products/updateProduct/${editingProduct}`, editFormData, config);
      if (response.data.success) {
        setProducts(products.map(p => p._id === editingProduct ? response.data.data : p));
        setEditingProduct(null);
      }
    } catch (error) { alert("Update failed"); }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${baseURL}/orders/editstatus`, { orderId: orderId, status: newStatus }, config);

      if (response.data.success) {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      console.log("Status updated to:", newStatus);
    }
    } catch (error) { console.log("Status update failed", error); }
  };

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Paid: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-6 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <h1 className="text-xl font-black tracking-tight">DASHBOARD</h1>
          </div>
          <button className="lg:hidden p-1 text-slate-400" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>
        
        <nav className="flex flex-col gap-2">
          {['products', 'orders'].map((tab) => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {tab === 'products' ? <Package size={20} /> : <ShoppingCart size={20} />}
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <button className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg shadow-sm" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="hidden sm:block text-2xl font-black text-slate-800 capitalize">{activeTab}</h2>
            <div className="flex gap-2">
              <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm"><RefreshCcw size={20} /></button>
              {activeTab === 'products' && (
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700">
                  <Plus size={18} /> <span>New Product</span>
                </button>
              )}
            </div>
          </div>

          {/* Add product Modal */}
          {isAddModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 sm:p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
      <button 
        onClick={() => setIsAddModalOpen(false)} 
        className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
      >
        <X size={28}/>
      </button>
      
      <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">Add Product</h2>
      <p className="text-slate-500 mb-8 text-sm">Fill in the details to list a new item.</p>

      <form onSubmit={handleAddProduct} className="space-y-5">
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product Name</label>
          <input 
            required
            type="text" 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 outline-none font-bold text-slate-700 transition-all" 
            placeholder="e.g. Wireless Earbuds"
            value={newProduct.name} 
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Price (Rs)</label>
            <input 
              required
              type="number" 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 outline-none font-bold text-slate-700 transition-all" 
              placeholder="1000"
              value={newProduct.price} 
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description</label>
          <textarea 
            required
            rows="3" 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 outline-none font-bold text-slate-700 transition-all" 
            placeholder="Describe the product features..."
            value={newProduct.description} 
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
          />
        </div>

        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
            Images (Max 5)
          </label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length > 5) {
                alert("You can only upload up to 5 images");
                e.target.value = null;
              } else {
                setNewProduct({...newProduct, images: files});
              }
            }}
          />
          <p className="text-[10px] text-slate-400 mt-2 italic">Selected: {newProduct.images.length} images</p>
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] mt-4"
        >
          Confirm & Add Product
        </button>
      </form>
    </div>
  </div>
)}


          {/* TABLE CONTAINER - Fixed for Mobile */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                    <th className="px-6 py-5">Item Details</th>
                    <th className="px-6 py-5">Price / Total</th>
                    <th className="px-6 py-5 w-[150px] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeTab === 'products' ? products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img 
                            src={p.image?.[0]?.startsWith('http') ? p.image[0] : `${baseURL}${p.image?.[0]}`} 
                            className="w-12 h-12 rounded-xl object-cover bg-slate-200 border border-slate-100 flex-shrink-0" 
                            alt={p.name}
                          />
                          <div className="font-bold text-slate-700 truncate max-w-[200px]">{p.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-black text-indigo-600">Rs {p.price}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => startEdit(p)} 
                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                            title="Edit Product"
                          >
                            <Edit size={18}/>
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p._id)} 
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                            title="Delete Product"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-5">
                        <div className="text-xs font-mono font-bold text-slate-400 mb-1 tracking-tighter">ID: {o._id.slice(-10).toUpperCase()}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold uppercase"><Calendar size={12}/> {new Date(o.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-5 font-black text-slate-800">Rs {o.totalPrice}</td>
                      <td className="px-6 py-5">
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                          className={`w-full text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2 outline-none border-2 border-transparent transition-all cursor-pointer ${statusStyles[o.status] || 'bg-gray-100'}`}
                        >
                          {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT PRODUCT MODAL (Enhanced Responsiveness) */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 sm:p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={28}/></button>
            <h2 className="text-3xl font-black mb-8 text-slate-800 tracking-tight">Update Details</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product Name</label>
                <input type="text" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 outline-none font-bold text-slate-700 transition-all" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Price (Rs)</label>
                <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 outline-none font-bold text-slate-700 transition-all" value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description</label>
                <textarea rows="3" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 outline-none font-bold text-slate-700 transition-all" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;