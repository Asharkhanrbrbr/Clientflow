import { Link } from 'react-router';
import { CheckCircle, BarChart3, Users, FileText, ArrowRight } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl"></div>
            <span className="text-2xl font-bold text-gray-900">ClientFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8">
            <span className="font-medium">Freelance Project Management Made Simple</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Manage Your Freelance Business Like a Pro
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Track clients, manage projects, and handle invoices all in one place. 
            Built specifically for freelancers and agencies.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 font-semibold transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Client Management</h3>
            <p className="text-gray-600">
              Keep all your client information organized. Track contact details, notes, and project history in one place.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Tracking</h3>
            <p className="text-gray-600">
              Monitor project status, deadlines, and budgets. Stay on top of active projects and deliverables.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Invoice Management</h3>
            <p className="text-gray-600">
              Create and track invoices effortlessly. Monitor payment status and never miss a payment again.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose ClientFlow?</h2>
          <div className="space-y-4">
            {[
              'Simple and intuitive interface designed for freelancers',
              'Track revenue and project performance with visual dashboards',
              'Manage multiple clients and projects simultaneously',
              'Monitor invoice payments and overdue items',
              'Secure authentication and data protection',
              'Responsive design works on all devices'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-colors"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2026 ClientFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
