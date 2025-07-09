import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import Projects from "./pages/Projects";
import AddTaskPage from './pages/AddTaskPage';
import TaskListPage from './pages/TaskListPage';
import EditTaskPage from './pages/EditTaskPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TaskCalendarPage from './pages/TaskCalendarPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/calendar" element={<TaskCalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
