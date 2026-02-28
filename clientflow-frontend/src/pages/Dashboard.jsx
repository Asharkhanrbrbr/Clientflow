import React, { useEffect, useState } from 'react';
import api from '../api';
import KpiCard from '../components/KpiCard';
import RevenueChart from '../components/RevenueChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { DollarSign, FileX, FolderKanban, Users } from 'lucide-react';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/summary');
        setSummary(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage error={error} />;
  if (!summary) return null;

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${Number(summary.totalRevenue || 0).toLocaleString()}`,
      Icon: DollarSign,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      title: 'Active Projects',
      value: summary.activeProjects,
      Icon: FolderKanban,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Total Clients',
      value: summary.clients,
      Icon: Users,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Unpaid Invoices',
      value: summary.unpaidInvoices,
      Icon: FileX,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your business.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard
            key={card.title}
            title={card.title}
            value={card.value}
            Icon={card.Icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
          />
        ))}
      </div>

      <RevenueChart data={summary.monthlyRevenue} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-semibold tracking-tight text-gray-900">Recent Activity</h3>
          <div className="mt-4 space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payment received</p>
                <p className="text-xs text-gray-500">Invoice #001 - $7,500</p>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New project created</p>
                <p className="text-xs text-gray-500">Mobile App Development</p>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New client added</p>
                <p className="text-xs text-gray-500">Emily Rodriguez</p>
              </div>
              <span className="text-xs text-gray-500">2d ago</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-semibold tracking-tight text-gray-900">Project Status</h3>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Active</span>
                <span className="text-sm font-semibold text-gray-900">{summary.activeProjects} projects</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">On Hold</span>
                <span className="text-sm font-semibold text-gray-900">1 project</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: '20%' }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Completed</span>
                <span className="text-sm font-semibold text-gray-900">1 project</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-green-600" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;