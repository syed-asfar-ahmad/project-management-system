import { useAuth } from "../context/AuthContext";
import ProjectList from "../components/ProjectList";


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
      <ProjectList />
    </div>
    
  );
}

export default Dashboard;
