# 💰 Finance Data Processing & Access Control Backend

## 🚀 Overview
This project is a backend system for managing financial records with role-based access control and dashboard analytics. It allows different users (Admin, Analyst, Viewer) to interact with financial data securely based on their permissions.

---

## 🧠 Features

### 🔐 Authentication
- User Registration & Login
- JWT-based authentication
- Password hashing using bcrypt

---

### 👥 User & Role Management
- Roles: **ADMIN, ANALYST, VIEWER**
- Admin can:
  - View all users
  - Update user roles
  - Activate/Deactivate users
- Inactive users cannot log in

---

### 🔒 Access Control (RBAC)
- Implemented using middleware
- **Viewer** → Can only access dashboard APIs
- **Analyst** → Can view records + dashboard
- **Admin** → Full access (users + records + dashboard)

---

### 💰 Financial Records
- Create, Read, Update, Delete records
- Filtering by:
  - Type (INCOME / EXPENSE)
  - Category
  - Date range
  - Amount range
- Search support (category & notes)
- Sorting (amount/date)
- Pagination support
- Soft delete (records are not permanently removed)

---

### 📊 Dashboard Analytics
- Total Income
- Total Expenses
- Net Balance
- Category-wise aggregation
- Monthly trends
- Recent activity (last 5 transactions)

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd finance-access-control-api

##Install Dependancies 
npm install

##Setup Environment Variables 
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
PORT=5000

##Setup Database
npx prisma generate
npx prisma db push

##Run Server
npm run dev

Server runs at:
http://localhost:5000


📡 API Endpoints
🔐 Auth
POST /api/auth/register
POST /api/auth/login

👥 Users (Admin Only)
GET /api/users
GET /api/users/:id
PUT /api/users/:id/role
PUT /api/users/:id/status

💰 Records
POST /api/records (Admin)
GET /api/records (Analyst, Admin)
PUT /api/records/:id (Admin)
DELETE /api/records/:id (Soft delete)

📊 Summary (All Users)
GET /api/summary/income
GET /api/summary/expense
GET /api/summary/balance
GET /api/summary/category
GET /api/summary/trends
GET /api/summary/recent


📬 API Documentation

A Postman collection is included for easy testing.

📁 File:
postman_collection.json
🚀 How to Use:
Open Postman
Click Import
Select the collection file
Login to get JWT token
Use Bearer Token for protected APIs
🔐 Authentication

Use Bearer Token in headers:

Authorization: Bearer <your_token>
📌 Assumptions
Roles are predefined (ADMIN, ANALYST, VIEWER)
Only Admin can modify data
Viewer has restricted access (dashboard only)
Soft delete is used instead of permanent deletion

✨ Key Highlights
Clean and modular backend architecture
Role-Based Access Control (RBAC)
Secure authentication system
Advanced filtering, search, and pagination
Dashboard analytics for financial insights
Soft delete implementation for data safety
🚀 Future Improvements
Rate limiting for API protection
Unit & integration testing
Swagger API documentation
Deployment (Render / AWS)

Author 
Srushti Pancham Mane