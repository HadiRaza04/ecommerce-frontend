import React from 'react';
import { Calendar } from 'lucide-react';

const OrderTable = ({ orders, onStatusUpdate }) => {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Paid: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <tbody className="divide-y divide-slate-100">
      {orders.map((o) => (
        <tr key={o._id} className="hover:bg-slate-50/50 transition">
          <td className="px-6 py-5">
            <div className="text-xs font-mono font-bold text-slate-400 mb-1 tracking-tighter">
              ID: {o._id.slice(-10).toUpperCase()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold uppercase">
              <Calendar size={12} /> {new Date(o.createdAt).toLocaleDateString()}
            </div>
          </td>
          <td className="px-6 py-5 font-black text-slate-800">Rs {o.totalPrice}</td>
          <td className="px-6 py-5 text-center">
            <select
              value={o.status}
              onChange={(e) => onStatusUpdate(o._id, e.target.value)}
              className={`w-32 text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2 outline-none cursor-pointer mx-auto block ${statusStyles[o.status] || 'bg-gray-100'}`}
            >
              {Object.keys(statusStyles).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default OrderTable;