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
          <li><button onClick={handleLogout} className={navLinkStyle}>Logout</button></li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 px-4 space-y-2 text-sm">
          <Link to={dashboardLink} onClick={() => setIsOpen(false)} className={navLinkStyle}>Dashboard</Link>
          <Link to="/projects" onClick={() => setIsOpen(false)} className={navLinkStyle}>Projects</Link>
          <Link to="/tasks" onClick={() => setIsOpen(false)} className={navLinkStyle}>Tasks</Link>
          <Link to="/calendar" onClick={() => setIsOpen(false)} className={navLinkStyle}>Calendar</Link>
          <button onClick={() => { handleLogout(); setIsOpen(false); }} className={navLinkStyle}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default AuthNavbar;
