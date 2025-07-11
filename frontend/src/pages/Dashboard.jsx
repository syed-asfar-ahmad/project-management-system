import { useAuth } from "../context/AuthContext";
import ProjectList from "../components/ProjectList";
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name || "User"}!</h1>
      <p className="text-gray-600">You are logged in as: {user?.role}</p>

      <button
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        onClick={logout}
      >
        Logout
      </button>

      {/* Only show Add Task if user is Admin or Manager */}
      {(user?.role === 'Admin' || user?.role === 'Manager') && (
        <div className="mt-4">
          <Link to="/add-task" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Task
          </Link>
        </div>
      )}

      <div className="mt-6">
        <ProjectList />
      </div>
    </div>
  );
}

export default Dashboard;
