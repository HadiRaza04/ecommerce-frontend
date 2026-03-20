import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import baseURL from '../../constraints';

const ProductTable = ({ products, onEdit, onDelete }) => (
  <tbody className="divide-y divide-slate-100">
    {products.map((p) => (
      <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <img src={p.image?.[0]?.startsWith('http') ? p.image[0] : `${baseURL}${p.image?.[0]}`} className="w-12 h-12 rounded-xl object-cover bg-slate-200 border border-slate-100 flex-shrink-0" alt={p.name} />
            <div className="font-bold text-slate-700 truncate max-w-[200px]">{p.name}</div>
          </div>
        </td>
        <td className="px-6 py-5 font-black text-indigo-600">Rs {p.price}</td>
        <td className="px-6 py-5 text-center">
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => onEdit(p)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit size={18}/></button>
            <button onClick={() => onDelete(p._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
);

export default ProductTable;