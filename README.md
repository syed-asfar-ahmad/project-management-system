# 🚀 TaskPilot - Professional Project Management System

A modern, feature-rich project management platform designed for teams to collaborate, track tasks, and deliver projects efficiently.

![TaskPilot Dashboard](https://img.shields.io/badge/Status-Live-green)
![React](https://img.shields.io/badge/React-18.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **Project Management** - Create, manage, and track projects with deadlines
- **Task Management** - Assign, prioritize, and monitor task progress
- **Team Collaboration** - Real-time comments and file sharing
- **Role-Based Access** - Admin, Manager, and Team Member roles
- **File Attachments** - Cloud storage with Vercel Blob
- **Calendar View** - Visual timeline of tasks and projects

### 👥 User Management
- **User Authentication** - Secure login/signup system
- **Profile Management** - Update personal information and preferences
- **Team Member Management** - Add, remove, and manage team roles
- **Role Promotion** - Admins can promote team members to managers

### 📊 Dashboard & Analytics
- **Overview Dashboard** - Project and task statistics
- **Progress Tracking** - Real-time status updates
- **Filtering & Search** - Advanced search and filter capabilities
- **Pagination** - Efficient data loading for large datasets

### 📱 User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Modern UI/UX** - Clean, intuitive interface with green theme
- **Real-time Updates** - Instant notifications and status changes
- **File Preview** - View images, PDFs, and documents in browser

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **FullCalendar** - Calendar component

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Vercel Blob** - Cloud file storage

### Deployment
- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Cloud database

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/16a34a/ffffff?text=TaskPilot+Dashboard)

### Project Management
![Projects](https://via.placeholder.com/800x400/7c3aed/ffffff?text=Project+Management)

### Task Calendar
![Calendar](https://via.placeholder.com/800x400/059669/ffffff?text=Calendar+View)

### Team Members
![Team](https://via.placeholder.com/800x400/dc2626/ffffff?text=Team+Management)

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Vercel account (for file storage)

### Clone the Repository
```bash
git clone https://github.com/yourusername/taskpilot.git
cd taskpilot
```

### Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

#### Website
```bash
cd website
npm install
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### Website (.env)
```env
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com/api
```

## 📖 Usage

### Starting the Development Servers

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend (Dashboard)
```bash
cd frontend
npm start
```

#### Website (Marketing Site)
```bash
cd website
npm start
```

### Default Admin Account
- **Email**: ahmad@example.com
- **Password**: admin123
- **Role**: Admin

### User Roles

#### Admin
- Full system access
- Can create/manage all projects and tasks
- Can promote team members to managers
- Can delete any content

#### Manager
- Can manage assigned projects
- Can create tasks for team members
- Can view project analytics
- Limited to assigned projects

#### Team Member
- Can view assigned tasks and projects
- Can update task status
- Can add comments and attachments
- Can view team members

## 📚 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Projects
```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/upload
```

### Tasks
```http
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
POST   /api/tasks/:id/comments
POST   /api/tasks/:id/upload
```

### Users
```http
GET    /api/users
GET    /api/users/team-members
PUT    /api/users/profile
PUT    /api/users/:userId/role
```

## 🌐 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables
3. Deploy as a Web Service

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Set environment variables
4. Deploy

### Website (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Vercel](https://vercel.com/) - Hosting & File Storage
- [Render](https://render.com/) - Backend Hosting
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Database

## 📞 Support

If you have any questions or need help, please:

- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ by the TaskPilot Team**

[Live Demo](https://your-dashboard-url.vercel.app) | [Documentation](https://your-docs-url.com) | [Report Bug](https://github.com/yourusername/taskpilot/issues)
