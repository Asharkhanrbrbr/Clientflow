import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Calendar, DollarSign, Edit, Filter, Plus, Trash2, X } from 'lucide-react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const emptyForm = {
  name: '',
  description: '',
  status: 'active',
  deadline: '',
  budget: '',
  clientId: ''
};

const formatDateInput = (dateValue) => {
  if (!dateValue) return '';
  return new Date(dateValue).toISOString().split('T')[0];
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const clientsById = useMemo(() => {
    const map = new Map();
    clients.forEach((client) => map.set(client._id, client));
    return map;
  }, [clients]);

  const loadClients = async () => {
    try {
      const res = await api.get('/clients', { params: { limit: 100 } });
      setClients(res.data?.clients || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load clients');
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await api.get('/projects', { params });
      setProjects(res.data?.projects || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load projects';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [statusFilter]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProject(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'active',
      deadline: formatDateInput(project.deadline),
      budget: project.budget?.toString() || '',
      clientId: project.clientId || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      budget: Number(formData.budget),
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined
    };

    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, payload);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created successfully');
      }
      closeModal();
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'active') return 'bg-blue-100 text-blue-700';
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'on-hold') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">Projects</h1>
          <p className="mt-2 text-gray-600">Track and manage your projects</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Project
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-5 w-5 text-gray-400" />
          {['all', 'active', 'completed', 'on-hold'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'on-hold' ? 'On Hold' : status}
            </button>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">No projects found</h3>
          <p className="mt-2 text-gray-600">Create a project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {projects.map((project) => {
            const client = clientsById.get(project.clientId);
            return (
              <div
                key={project._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-gray-900">{project.name}</h3>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(project.status)}`}>
                      {project.status === 'on-hold' ? 'On Hold' : project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                      aria-label="Edit project"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                      aria-label="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mb-4 text-sm text-gray-600">{project.description || 'No description provided.'}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget: ${Number(project.budget || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="text-sm font-medium text-gray-900">{client ? client.name : 'Unknown client'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-2 transition-colors hover:bg-gray-100" aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Client *</label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}{client.company ? ` - ${client.company}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Budget *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
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
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Projects;
