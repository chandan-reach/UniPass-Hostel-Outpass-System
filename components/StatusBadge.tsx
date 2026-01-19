
import React from 'react';
import { OutpassStatus } from '../types';

interface StatusBadgeProps {
  status: OutpassStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    [OutpassStatus.PENDING]: { color: 'bg-blue-100 text-blue-700', label: 'Pending' },
    [OutpassStatus.APPROVED]: { color: 'bg-emerald-100 text-emerald-700', label: 'Approved' },
    [OutpassStatus.REJECTED]: { color: 'bg-rose-100 text-rose-700', label: 'Rejected' },
    [OutpassStatus.OUT]: { color: 'bg-amber-100 text-amber-700', label: 'Out of Hostel' },
    [OutpassStatus.RETURNED]: { color: 'bg-slate-100 text-slate-700', label: 'Returned' },
  };

  const { color, label } = config[status];

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
