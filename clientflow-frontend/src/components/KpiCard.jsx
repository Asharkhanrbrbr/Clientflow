import React from 'react';

const KpiCard = ({ title, value, Icon, iconBg = 'bg-blue-50', iconColor = 'text-blue-700' }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="mb-1 text-sm text-gray-600">{title}</p>
        <p className="text-5xl font-bold tracking-tight text-gray-900">{value}</p>
      </div>
      <div className={`${iconBg} flex h-14 w-14 items-center justify-center rounded-2xl`}>
        {Icon ? <Icon className={`${iconColor} h-7 w-7`} /> : <span className={`${iconColor} text-2xl`}>$</span>}
      </div>
    </div>
  </div>
);

export default KpiCard;