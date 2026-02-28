import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
    <h1 className="text-5xl font-extrabold text-blue-800 mb-4">ClientFlow</h1>
    <p className="text-xl text-blue-700 mb-8">The freelance project management dashboard</p>
    <div className="flex gap-4">
      <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">Login</Link>
      <Link to="/register" className="px-6 py-2 bg-white text-blue-700 border border-blue-600 rounded shadow hover:bg-blue-50 transition">Register</Link>
    </div>
  </div>
);

export default Landing;
