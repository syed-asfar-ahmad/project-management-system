import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Projects from "./pages/Projects";
import AddTaskPage from "./pages/AddTaskPage";
import TaskListPage from "./pages/TaskListPage";
import EditTaskPage from "./pages/EditTaskPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TaskCalendarPage from "./pages/TaskCalendarPage";
import PrivateRoute from "./utils/PrivateRoute";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import { useAuth } from "./context/AuthContext";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreateProject from "./pages/CreateProject";
import EditProjectPage from "./pages/EditProjectPage";
import TeamDashboard from "./pages/TeamDashboard";
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InLineLoader from "./components/InLineLoader";
import ProfilePage from "./pages/ProfilePage";
import AllMembersPage from "./pages/AllMembersPage";




function AppRoutes() {
  const { token, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-10">
        <InLineLoader message="Loading User Information" />
      </div>
    );
  }


  return (
    <Router>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#333',
            fontWeight: '500',
            border: '1px solid #ccc',
            padding: '12px 16px',
          },
        }} 
      />
      <Routes>
        <Route
          path="/login"
          element={
            token ? (
              user?.role === "Team Member"
                ? <Navigate to="/team-dashboard" />
                : <Navigate to="/dashboard" />
            ) : <Login />
          }
        />
        <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><TaskListPage /></PrivateRoute>} />
        <Route path="/tasks/:id" element={<PrivateRoute><TaskDetailPage /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><TaskCalendarPage /></PrivateRoute>} />
        <Route path="/projects/edit/:id" element={<EditProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/members" element={<AllMembersPage />} />

        {/* Role-based Routes */}
        <Route path="/add-task" element={
          <RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
            <AddTaskPage />
          </RoleBasedRoute>
        } />
        <Route path="/tasks/:id/edit" element={
          <RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
            <EditTaskPage />
          </RoleBasedRoute>
        } />

        <Route
            path="/projects/:id"
            element={
                <PrivateRoute>
                    <ProjectDetailPage />
                </PrivateRoute>
        }
        />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/projects/create" element={<CreateProject />} />

        <Route
          path="/team-dashboard"
          element={
            <RoleBasedRoute allowedRoles={["Team Member"]}>
              <TeamDashboard />
            </RoleBasedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

    </Router>
  );
}

export default AppRoutes;
