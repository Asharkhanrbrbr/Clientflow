You are a senior full-stack engineer.

Help me build a production-ready MERN SaaS application called "ClientFlow" — a freelance project management dashboard.

Tech stack:
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT (access + refresh tokens)
- Styling: TailwindCSS
- Charts: Recharts
- Validation: Zod or express-validator

Architecture Requirements:
- Clean folder structure (separate routes, controllers, models, middleware)
- MVC pattern
- Centralized error handling middleware
- Protected routes using JWT middleware
- Role-based access control (roles: admin, freelancer)
- Environment variables for secrets
- Proper HTTP status codes
- Pagination, filtering, search support
- Input validation
- Secure password hashing (bcrypt)
- No monolithic files

Database Models:

User:
- name
- email (unique)
- password (hashed)
- role (admin/freelancer)
- createdAt

Client:
- name
- email
- company
- phone
- notes
- userId (reference)

Project:
- name
- description
- status (active/completed/on-hold)
- deadline
- budget
- clientId (reference)
- userId (reference)

Invoice:
- projectId (reference)
- amount
- status (paid/unpaid/overdue)
- issueDate
- dueDate
- userId (reference)

Backend API Requirements:

Auth Routes:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/auth/me

Client Routes:
- CRUD with search & pagination

Project Routes:
- CRUD with filtering by status

Invoice Routes:
- CRUD
- Auto-mark overdue if dueDate passed

Dashboard Route:
- GET /api/dashboard/summary
  Should return:
    - total revenue
    - unpaid invoices count
    - active projects
    - monthly revenue aggregation

Frontend Requirements:

Pages:
- Landing page
- Login/Register
- Protected Dashboard
- Clients page
- Projects page
- Invoices page

Features:
- Axios with interceptors
- Protected routes wrapper
- Global auth context
- Reusable form components
- Toast notifications
- Loading states
- Proper error display

UI:
- Clean SaaS style
- Responsive
- Sidebar layout for dashboard
- KPI cards on dashboard
- Revenue chart (monthly)

Now:
1. First generate backend folder structure.
2. Then generate Mongoose schemas.
3. Then generate auth controller and middleware.
4. Then generate one fully implemented CRUD example (Clients).
5. Do not skip security best practices.
6. Do not oversimplify.

Explain architectural decisions briefly when necessary.