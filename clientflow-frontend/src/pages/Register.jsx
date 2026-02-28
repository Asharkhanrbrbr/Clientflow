import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Register</h2>
        <FormInput label="Name" name="name" value={form.name} onChange={handleChange} error={error && !form.name ? error : ''} autoFocus />
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={error && !form.email ? error : ''} />
        <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={error && !form.password ? error : ''} />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <FormButton loading={loading}>Register</FormButton>
        <div className="mt-4 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
