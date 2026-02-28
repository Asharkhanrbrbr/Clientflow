import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Building2,
  Edit,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  X
} from 'lucide-react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = {
  name: '',
  email: '',
  company: '',
  phone: '',
  notes: ''
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadClients = async (term = searchTerm) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/clients', {
        params: {
          search: term,
          limit: 100
        }
      });
      setClients(res.data?.clients || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load clients';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadClients(searchTerm);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingClient(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      company: client.company || '',
      phone: client.phone || '',
      notes: client.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient._id}`, formData);
        toast.success('Client updated successfully');
      } else {
        await api.post('/clients', formData);
        toast.success('Client created successfully');
      }
      closeModal();
      loadClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save client');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      await api.delete(`/clients/${id}`);
      toast.success('Client deleted successfully');
      loadClients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete client');
    }
  };

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">Clients</h1>
          <p className="mt-2 text-gray-600">Manage your client relationships</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Client
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or company"
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <UserRound className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">No clients found</h3>
          <p className="mt-2 text-gray-600">Add your first client to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {clients.map((client) => (
            <div
              key={client._id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-gray-900">{client.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>{client.company || 'No company provided'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                    aria-label="Edit client"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                    aria-label="Delete client"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${client.phone || ''}`} className="hover:text-blue-600">
                    {client.phone || 'No phone provided'}
                  </a>
                </div>
              </div>

              {client.notes ? (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600">{client.notes}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-2 transition-colors hover:bg-gray-100" aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                  {editingClient ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Clients;
