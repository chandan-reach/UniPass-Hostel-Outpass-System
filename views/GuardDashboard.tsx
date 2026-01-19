
import React, { useState } from 'react';
import { Outpass, OutpassStatus } from '../types';
import StatusBadge from '../components/StatusBadge';

interface GuardDashboardProps {
  outpasses: Outpass[];
  onGateAction: (id: string, status: OutpassStatus) => void;
}

const GuardDashboard: React.FC<GuardDashboardProps> = ({ outpasses, onGateAction }) => {
  const [search, setSearch] = useState('');

  // Filter for approved passes or passes that are currently out
  const activePasses = outpasses.filter(p => 
    (p.status === OutpassStatus.APPROVED || p.status === OutpassStatus.OUT) &&
    (p.studentName.toLowerCase().includes(search.toLowerCase()) || 
     p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const completedPasses = outpasses.filter(p => p.status === OutpassStatus.RETURNED);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security Gate Terminal</h1>
          <p className="text-slate-500">Verify student entry and exit movements</p>
        </div>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search by ID or Name..."
            className="w-full md:w-80 px-10 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
          <h2 className="font-bold text-amber-800 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Current Active Passes
          </h2>
          <span className="text-xs font-bold text-amber-600 px-2 py-0.5 bg-amber-100 rounded-full">{activePasses.length} Active</span>
        </div>
        <div className="overflow-x-auto">
          {activePasses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400">No active movements matching your search.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student Info</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Movement Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Destination</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activePasses.map(pass => (
                  <tr key={pass.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{pass.studentName}</p>
                      <p className="text-[10px] font-mono font-bold text-slate-400">{pass.id.toUpperCase()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={pass.status} />
                      {pass.actualOutTimestamp && (
                        <p className="text-[10px] mt-1 text-slate-500">Left: {new Date(pass.actualOutTimestamp).toLocaleTimeString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600 font-medium">{pass.destination}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {pass.status === OutpassStatus.APPROVED ? (
                        <button 
                          onClick={() => onGateAction(pass.id, OutpassStatus.OUT)}
                          className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-amber-700 shadow-sm"
                        >
                          Confirm Exit
                        </button>
                      ) : (
                        <button 
                          onClick={() => onGateAction(pass.id, OutpassStatus.RETURNED)}
                          className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-900 shadow-sm"
                        >
                          Confirm Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden opacity-75">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-500">Today's Completed Movements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Student</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">In Time</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedPasses.map(pass => (
                <tr key={pass.id}>
                  <td className="px-6 py-4 text-sm text-slate-500">{pass.studentName}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{pass.actualInTimestamp ? new Date(pass.actualInTimestamp).toLocaleTimeString() : 'N/A'}</td>
                  <td className="px-6 py-4"><StatusBadge status={pass.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuardDashboard;
