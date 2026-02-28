import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Calendar, DollarSign, Edit, Plus, Trash2, X } from 'lucide-react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = {
  projectId: '',
  amount: '',
  status: 'unpaid',
  issueDate: '',
  dueDate: ''
};

const formatDateInput = (dateValue) => {
  if (!dateValue) return '';
  return new Date(dateValue).toISOString().split('T')[0];
};

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const projectsById = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => map.set(project._id, project));
    return map;
  }, [projects]);

  const loadProjects = async () => {
    try {
      const res = await api.get('/projects', { params: { limit: 100 } });
      setProjects(res.data?.projects || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load projects');
    }
  };

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/invoices', { params: { limit: 100 } });
      setInvoices(res.data?.invoices || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load invoices';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadInvoices();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingInvoice(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      projectId: invoice.projectId || '',
      amount: invoice.amount?.toString() || '',
      status: invoice.status || 'unpaid',
      issueDate: formatDateInput(invoice.issueDate),
      dueDate: formatDateInput(invoice.dueDate)
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      issueDate: new Date(formData.issueDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString()
    };

    try {
      if (editingInvoice) {
        await api.put(`/invoices/${editingInvoice._id}`, payload);
        toast.success('Invoice updated successfully');
      } else {
        await api.post('/invoices', payload);
        toast.success('Invoice created successfully');
      }
      closeModal();
      loadInvoices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save invoice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await api.delete(`/invoices/${id}`);
      toast.success('Invoice deleted successfully');
      loadInvoices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete invoice');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'unpaid') return 'bg-amber-100 text-amber-700';
    if (status === 'overdue') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const totalByStatus = (status) =>
    invoices
      .filter((invoice) => invoice.status === status)
      .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0)
      .toLocaleString();

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">Invoices</h1>
          <p className="mt-2 text-gray-600">Manage and track your invoices</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-sm text-gray-600">Total Paid</p>
          <p className="text-3xl font-bold tracking-tight text-green-600">${totalByStatus('paid')}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-sm text-gray-600">Pending Payment</p>
          <p className="text-3xl font-bold tracking-tight text-amber-600">${totalByStatus('unpaid')}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-sm text-gray-600">Overdue</p>
          <p className="text-3xl font-bold tracking-tight text-red-600">${totalByStatus('overdue')}</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">No invoices found</h3>
          <p className="mt-2 text-gray-600">Create an invoice to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Issue Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{invoice._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{projectsById.get(invoice.projectId)?.name || 'Unknown project'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        {Number(invoice.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          aria-label="Edit invoice"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          aria-label="Delete invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                {editingInvoice ? 'Edit Invoice' : 'Add New Invoice'}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-2 transition-colors hover:bg-gray-100" aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Project *</label>
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, projectId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Amount *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Issue Date *</label>
                <input
                  type="date"
                  required
                  value={formData.issueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {editingInvoice ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Invoices;
