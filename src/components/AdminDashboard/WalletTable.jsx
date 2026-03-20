import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const WalletTable = ({ wallets, walletAmount, setWalletAmount, onAction }) => (
  <tbody className="divide-y divide-slate-100">
    {wallets.map((w) => (
      <tr key={w._id} className="hover:bg-slate-50/50 transition">
        <td className="px-6 py-5">
          <div className="font-bold text-slate-700">{w.user?.name || "No Name"}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{w.user?.email}</div>
        </td>
        <td className="px-6 py-5 font-black text-green-600">Rs {w.balance.toLocaleString()}</td>
        <td className="px-6 py-5">
          <div className="flex items-center justify-center gap-2">
            <input 
              type="number" 
              placeholder="Amt" 
              className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)} 
            />
            <button onClick={() => onAction(w.user?._id, 'add')} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><ArrowUpCircle size={20}/></button>
            <button onClick={() => onAction(w.user?._id, 'reduce')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><ArrowDownCircle size={20}/></button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
);

export default WalletTable;