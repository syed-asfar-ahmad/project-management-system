# 🚀 TaskPilot

**Professional Project Management System for Modern Teams**

[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)

---

## ✨ Features

- 🎯 **Project & Task Management** - Create, assign, and track projects with deadlines
- 👥 **Team Collaboration** - Role-based access (Admin, Manager, Team Member)
- 📁 **File Attachments** - Cloud storage with Vercel Blob
- 📅 **Calendar View** - Visual timeline of tasks and projects
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔐 **Secure Authentication** - JWT-based user authentication

## 🛠 Tech Stack

| Frontend | Backend | Deployment |
|----------|---------|------------|
| React 18 | Node.js | Render |
| Tailwind CSS | Express.js | Vercel |
| Lucide React | MongoDB | MongoDB Atlas |
| FullCalendar | JWT | Vercel Blob |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Vercel account

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/taskpilot.git
cd taskpilot

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../website && npm install
```

### Environment Setup

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**Frontend (.env)**
```env
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### Run Development Servers

```bash
# Backend
cd backend && npm run dev

# Frontend (Dashboard)
cd frontend && npm start

# Website (Marketing)
cd website && npm start
```

## 👤 Default Admin Account

- **Email**: `ahmad@example.com`
- **Password**: `admin123`
- **Role**: Admin

## 🎭 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, manage all projects/tasks, promote users |
| **Manager** | Manage assigned projects, create tasks, view analytics |
| **Team Member** | View assigned tasks, update status, add comments |

## 📱 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/300x200/16a34a/ffffff?text=Dashboard" alt="Dashboard" width="300"/>
  <img src="https://via.placeholder.com/300x200/7c3aed/ffffff?text=Projects" alt="Projects" width="300"/>
  <img src="https://via.placeholder.com/300x200/059669/ffffff?text=Calendar" alt="Calendar" width="300"/>
</div>

## 🌐 Live Demo

- **Dashboard**: [https://your-dashboard-url.vercel.app](https://your-dashboard-url.vercel.app)
- **Website**: [https://your-website-url.vercel.app](https://your-website-url.vercel.app)

## 📚 API Endpoints

### Core Routes
```http
POST   /api/auth/login          # User authentication
GET    /api/projects            # Get all projects
POST   /api/projects            # Create new project
GET    /api/tasks               # Get all tasks
POST   /api/tasks               # Create new task
PUT    /api/users/:id/role      # Update user role
```

## 🚀 Deployment

### Backend (Render)
1. Connect GitHub repo to Render
2. Set environment variables
3. Deploy as Web Service

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <strong>Made with ❤️ by the TaskPilot Team</strong>
  
  [Report Bug](https://github.com/yourusername/taskpilot/issues) • [Request Feature](https://github.com/yourusername/taskpilot/issues)
</div>
