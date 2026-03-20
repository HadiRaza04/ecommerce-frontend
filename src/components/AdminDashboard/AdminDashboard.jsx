import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCcw, Loader2, Menu, Plus } from 'lucide-react';
import baseURL from '../../constraints';

// Components
import Sidebar from './Sidebar';
import ProductTable from './ProductTable';
import WalletTable from './WalletTable';
import OrderTable from './OrderTable';
import { AddProductModal, EditProductModal } from './ProductModals';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [data, setData] = useState({ products: [], orders: [], wallets: [] });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', images: [] });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: '', description: '' });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, walletRes] = await Promise.all([
        axios.get(`${baseURL}/products`, config),
        axios.get(`${baseURL}/orders`, config),
        axios.get(`${baseURL}/wallet/allwallets`, config)
      ]);
      setData({
        products: prodRes.data.data || prodRes.data,
        orders: orderRes.data.data || orderRes.data,
        wallets: walletRes.data
      });
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Handlers for API calls (Delete, Update Status, Wallet, etc.)
  const handleWalletAction = async (userId, type) => {
    const url = type === 'add' ? `${baseURL}/wallet/` : `${baseURL}/wallet/decrease`;
    try {
      await axios.post(url, { userId, amount: Number(walletAmount) }, config);
      setWalletAmount('');
      fetchData();
    } catch (error) { alert("Failed"); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${baseURL}/orders/editstatus`, { orderId, status }, config);
      fetchData();
    } catch (error) { alert("Update failed"); }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <Header activeTab={activeTab} onRefresh={fetchData} onOpenAdd={() => setIsAddModalOpen(true)} onOpenSidebar={() => setIsSidebarOpen(true)} />

          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left min-w-[700px]">
                <TableHead activeTab={activeTab} />
                {activeTab === 'products' && <ProductTable products={data.products} onEdit={(p) => { setEditingProduct(p); setEditFormData(p); }} onDelete={fetchData} />}
                {activeTab === 'wallets' && <WalletTable wallets={data.wallets} walletAmount={walletAmount} setWalletAmount={setWalletAmount} onAction={handleWalletAction} />}
                {activeTab === 'orders' && <OrderTable orders={data.orders} onStatusUpdate={updateOrderStatus} />}
              </table>
            </div>
          </div>
        </div>
      </main>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} formData={newProduct} setFormData={setNewProduct} onSubmit={fetchData} />
      <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} formData={editFormData} setFormData={setEditFormData} onSubmit={fetchData} />
    </div>
  );
};

// Internal Helper Components for cleaner code
const Header = ({ activeTab, onRefresh, onOpenAdd, onOpenSidebar }) => (
  <div className="flex items-center justify-between mb-6">
    <button className="lg:hidden p-2 bg-white border rounded-lg" onClick={onOpenSidebar}><Menu size={24} /></button>
    <h2 className="text-2xl font-black capitalize">{activeTab}</h2>
    <div className="flex gap-2">
      <button onClick={onRefresh} className="p-2.5 bg-white border rounded-xl"><RefreshCcw size={20} /></button>
      {activeTab === 'products' && (
        <button onClick={onOpenAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold"><Plus size={18} /> New Product</button>
      )}
    </div>
  </div>
);

const TableHead = ({ activeTab }) => (
  <thead className="bg-slate-50/50 border-b">
    <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
      <th className="px-6 py-5">{activeTab === 'wallets' ? 'User Info' : 'Item Details'}</th>
      <th className="px-6 py-5">{activeTab === 'wallets' ? 'Balance' : 'Price / Total'}</th>
      <th className="px-6 py-5 text-center">Actions</th>
    </tr>
  </thead>
);

export default AdminDashboard;