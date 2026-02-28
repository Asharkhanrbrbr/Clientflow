import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form.email, form.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Login</h2>
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={error && !form.email ? error : ''} autoFocus />
        <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={error && !form.password ? error : ''} />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <FormButton loading={loading}>Login</FormButton>
        <div className="mt-4 text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
