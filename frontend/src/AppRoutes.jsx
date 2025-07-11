import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
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


function AppRoutes() {
  const { token, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Loading user info...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><TaskListPage /></PrivateRoute>} />
        <Route path="/tasks/:id" element={<PrivateRoute><TaskDetailPage /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><TaskCalendarPage /></PrivateRoute>} />

        {/* Role-based Routes */}
        <Route path="/add-task" element={
          <RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
            <AddTaskPage />
          </RoleBasedRoute>
        } />
        <Route path="/tasks/edit/:id" element={
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
      </Routes>
    </Router>
  );
}

export default AppRoutes;
