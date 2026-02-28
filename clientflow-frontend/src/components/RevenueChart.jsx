import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const RevenueChart = ({ data = [] }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-6">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Revenue Overview</h2>
      <p className="mt-1 text-sm text-gray-600">Monthly revenue for the last 6 months</p>
    </div>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={true} />
          <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '14px' }} tickLine={false} axisLine={{ stroke: '#9CA3AF' }} />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '14px' }}
            domain={[0, 22000]}
            ticks={[0, 5500, 11000, 16500, 22000]}
            tickFormatter={(value) => {
              if (value === 0) return '$0k';
              const kValue = value / 1000;
              return Number.isInteger(kValue) ? `$${kValue}k` : `$${kValue.toFixed(1)}k`;
            }}
            tickLine={false}
            axisLine={{ stroke: '#9CA3AF' }}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)'
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2.2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4, fill: '#ffffff' }}
            activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: '#3B82F6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default RevenueChart;