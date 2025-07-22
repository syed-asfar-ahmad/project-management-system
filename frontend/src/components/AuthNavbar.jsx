import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function AuthNavbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardLink =
    user?.role === "Team Member" ? "/team-dashboard" : "/dashboard";

  const navLinkStyle =
    "transition-all duration-200 px-3 py-1 rounded-md hover:bg-white hover:text-blue-600";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">TaskPilot</h1>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 text-sm items-center">
          <li><Link to={dashboardLink} className={navLinkStyle}>Dashboard</Link></li>
          <li><Link to="/projects" className={navLinkStyle}>Projects</Link></li>
          <li><Link to="/tasks" className={navLinkStyle}>Tasks</Link></li>
          <li><Link to="/calendar" className={navLinkStyle}>Calendar</Link></li>
          <li><Link to="/profile" className={navLinkStyle}>Profile</Link></li>
          <li><button onClick={handleLogout} className={navLinkStyle}>Logout</button></li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 mx-4 bg-white text-blue-600 rounded-lg shadow-lg py-4 px-3 space-y-3 transition-all duration-300">
          <Link
            to={dashboardLink}
            onClick={() => setIsOpen(false)}
            className="block font-medium hover:bg-blue-100 px-4 py-2 rounded-md"
          >
            Dashboard
          </Link>
          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className="block font-medium hover:bg-blue-100 px-4 py-2 rounded-md"
          >
            Projects
          </Link>
          <Link
            to="/tasks"
            onClick={() => setIsOpen(false)}
            className="block font-medium hover:bg-blue-100 px-4 py-2 rounded-md"
          >
            Tasks
          </Link>
          <Link
            to="/calendar"
            onClick={() => setIsOpen(false)}
            className="block font-medium hover:bg-blue-100 px-4 py-2 rounded-md"
          >
            Calendar
          </Link>
                    <Link
            to="/calendar"
            onClick={() => setIsOpen(false)}
            className="block font-medium hover:bg-blue-100 px-4 py-2 rounded-md"
          >
            Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left font-medium text-red-600 hover:bg-red-100 px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      )}

    </nav>
  );
}

export default AuthNavbar;
