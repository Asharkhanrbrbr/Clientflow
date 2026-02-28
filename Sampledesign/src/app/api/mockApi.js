// Mock API responses to simulate backend

// Mock data storage
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'demo@clientflow.com',
    role: 'freelancer'
  }
];

let mockClients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    company: 'TechCorp Inc',
    phone: '+1 (555) 123-4567',
    notes: 'Prefers email communication',
    userId: '1'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@designstudio.com',
    company: 'Design Studio',
    phone: '+1 (555) 234-5678',
    notes: 'Long-term client, flexible deadlines',
    userId: '1'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@startupventures.com',
    company: 'Startup Ventures',
    phone: '+1 (555) 345-6789',
    notes: 'Fast-paced projects',
    userId: '1'
  }
];

let mockProjects = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    description: 'Complete redesign of the company e-commerce platform',
    status: 'active',
    deadline: '2026-04-15',
    budget: 15000,
    clientId: '1',
    userId: '1'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'iOS and Android app for customer management',
    status: 'active',
    deadline: '2026-05-20',
    budget: 25000,
    clientId: '2',
    userId: '1'
  },
  {
    id: '3',
    name: 'Brand Identity Package',
    description: 'Logo, color scheme, and brand guidelines',
    status: 'completed',
    deadline: '2026-02-01',
    budget: 8000,
    clientId: '3',
    userId: '1'
  },
  {
    id: '4',
    name: 'SEO Optimization',
    description: 'Website SEO audit and optimization',
    status: 'on-hold',
    deadline: '2026-03-30',
    budget: 5000,
    clientId: '1',
    userId: '1'
  }
];

let mockInvoices = [
  {
    id: '1',
    projectId: '1',
    amount: 7500,
    status: 'paid',
    issueDate: '2026-02-01',
    dueDate: '2026-02-15',
    userId: '1'
  },
  {
    id: '2',
    projectId: '2',
    amount: 12500,
    status: 'unpaid',
    issueDate: '2026-02-15',
    dueDate: '2026-03-15',
    userId: '1'
  },
  {
    id: '3',
    projectId: '3',
    amount: 8000,
    status: 'paid',
    issueDate: '2026-01-15',
    dueDate: '2026-02-01',
    userId: '1'
  },
  {
    id: '4',
    projectId: '1',
    amount: 7500,
    status: 'overdue',
    issueDate: '2026-01-01',
    dueDate: '2026-01-15',
    userId: '1'
  }
];

// Delay helper to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  auth: {
    login: async (email, password) => {
      await delay(500);
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user
        }
      };
    },
    register: async (name, email, password, role) => {
      await delay(500);
      const newUser = {
        id: String(mockUsers.length + 1),
        name,
        email,
        role
      };
      mockUsers.push(newUser);
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: newUser
        }
      };
    },
    me: async () => {
      await delay(200);
      return { data: mockUsers[0] };
    }
  },

  dashboard: {
    getSummary: async () => {
      await delay(300);
      
      // Calculate stats
      const totalRevenue = mockInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      const unpaidInvoicesCount = mockInvoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue').length;
      
      const activeProjects = mockProjects.filter(proj => proj.status === 'active').length;
      
      // Monthly revenue aggregation (last 6 months)
      const monthlyRevenue = [
        { month: 'Sep', revenue: 12000 },
        { month: 'Oct', revenue: 18000 },
        { month: 'Nov', revenue: 15000 },
        { month: 'Dec', revenue: 22000 },
        { month: 'Jan', revenue: 19000 },
        { month: 'Feb', revenue: 15500 }
      ];
      
      return {
        data: {
          totalRevenue,
          unpaidInvoicesCount,
          activeProjects,
          monthlyRevenue,
          totalClients: mockClients.length
        }
      };
    }
  },

  clients: {
    getAll: async (search, page = 1, limit = 10) => {
      await delay(300);
      let filtered = [...mockClients];
      
      if (search) {
        filtered = filtered.filter(client => 
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.company.toLowerCase().includes(search.toLowerCase()) ||
          client.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = filtered.slice(start, end);
      
      return {
        data: {
          clients: paginated,
          total: filtered.length,
          page,
          limit
        }
      };
    },
    getById: async (id) => {
      await delay(200);
      const client = mockClients.find(c => c.id === id);
      if (!client) throw new Error('Client not found');
      return { data: client };
    },
    create: async (clientData) => {
      await delay(400);
      const newClient = {
        ...clientData,
        id: String(mockClients.length + 1),
        userId: '1'
      };
      mockClients.push(newClient);
      return { data: newClient };
    },
    update: async (id, clientData) => {
      await delay(400);
      const index = mockClients.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Client not found');
      mockClients[index] = { ...mockClients[index], ...clientData };
      return { data: mockClients[index] };
    },
    delete: async (id) => {
      await delay(300);
      const index = mockClients.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Client not found');
      mockClients.splice(index, 1);
      return { data: { message: 'Client deleted' } };
    }
  },

  projects: {
    getAll: async (status, page = 1, limit = 10) => {
      await delay(300);
      let filtered = [...mockProjects];
      
      if (status && status !== 'all') {
        filtered = filtered.filter(project => project.status === status);
      }
      
      // Add client names
      const enriched = filtered.map(project => {
        const client = mockClients.find(c => c.id === project.clientId);
        return { ...project, clientName: client?.name || 'Unknown' };
      });
      
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = enriched.slice(start, end);
      
      return {
        data: {
          projects: paginated,
          total: filtered.length,
          page,
          limit
        }
      };
    },
    getById: async (id) => {
      await delay(200);
      const project = mockProjects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');
      const client = mockClients.find(c => c.id === project.clientId);
      return { data: { ...project, clientName: client?.name } };
    },
    create: async (projectData) => {
      await delay(400);
      const newProject = {
        ...projectData,
        id: String(mockProjects.length + 1),
        userId: '1'
      };
      mockProjects.push(newProject);
      return { data: newProject };
    },
    update: async (id, projectData) => {
      await delay(400);
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Project not found');
      mockProjects[index] = { ...mockProjects[index], ...projectData };
      return { data: mockProjects[index] };
    },
    delete: async (id) => {
      await delay(300);
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Project not found');
      mockProjects.splice(index, 1);
      return { data: { message: 'Project deleted' } };
    }
  },

  invoices: {
    getAll: async (page = 1, limit = 10) => {
      await delay(300);
      
      // Add project names
      const enriched = mockInvoices.map(invoice => {
        const project = mockProjects.find(p => p.id === invoice.projectId);
        return { ...invoice, projectName: project?.name || 'Unknown' };
      });
      
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = enriched.slice(start, end);
      
      return {
        data: {
          invoices: paginated,
          total: mockInvoices.length,
          page,
          limit
        }
      };
    },
    getById: async (id) => {
      await delay(200);
      const invoice = mockInvoices.find(i => i.id === id);
      if (!invoice) throw new Error('Invoice not found');
      const project = mockProjects.find(p => p.id === invoice.projectId);
      return { data: { ...invoice, projectName: project?.name } };
    },
    create: async (invoiceData) => {
      await delay(400);
      const newInvoice = {
        ...invoiceData,
        id: String(mockInvoices.length + 1),
        userId: '1'
      };
      mockInvoices.push(newInvoice);
      return { data: newInvoice };
    },
    update: async (id, invoiceData) => {
      await delay(400);
      const index = mockInvoices.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Invoice not found');
      mockInvoices[index] = { ...mockInvoices[index], ...invoiceData };
      return { data: mockInvoices[index] };
    },
    delete: async (id) => {
      await delay(300);
      const index = mockInvoices.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Invoice not found');
      mockInvoices.splice(index, 1);
      return { data: { message: 'Invoice deleted' } };
    }
  }
};
