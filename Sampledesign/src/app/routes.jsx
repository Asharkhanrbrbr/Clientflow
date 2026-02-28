import { createBrowserRouter, Navigate } from 'react-router';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Projects } from './pages/Projects';
import { Invoices } from './pages/Invoices';
import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'clients',
        element: <Clients />
      },
      {
        path: 'projects',
        element: <Projects />
      },
      {
        path: 'invoices',
        element: <Invoices />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
