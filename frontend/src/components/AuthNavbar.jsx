import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { getAvatarUrl } from "../utils/avatarUtils";

function AuthNavbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardLink = user?.role === "Team Member" ? "/team-dashboard" : user?.role === "Manager" ? "/manager-dashboard" : "/dashboard";

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => {
    const active = isActive(path);
    return `
      relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
      ${active 
        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
        : 'text-white/90 hover:text-white hover:bg-white/10'
      }
    `;
  };

  const mobileLinkStyle = (path) => {
    const active = isActive(path);
    return `
      block px-4 py-3 rounded-lg font-medium transition-all duration-200
      ${active 
        ? 'text-green-600 bg-green-50 border-l-4 border-green-600' 
        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
      }
    `;
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-green-600/95 backdrop-blur-md shadow-lg border-b border-green-500/20' 
        : 'bg-green-600 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={dashboardLink} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TaskPilot</h1>
              <p className="text-xs text-white/70 -mt-1 capitalize">{user?.role}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to={dashboardLink} className={navLinkStyle(dashboardLink)}>
              <span className="relative">
                Dashboard
                {isActive(dashboardLink) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full"></span>
                )}
              </span>
            </Link>
            <Link to="/projects" className={navLinkStyle("/projects")}>
              <span className="relative">
                Projects
                {isActive("/projects") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full"></span>
                )}
              </span>
            </Link>
            <Link to="/tasks" className={navLinkStyle("/tasks")}>
              <span className="relative">
                Tasks
                {isActive("/tasks") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full"></span>
                )}
              </span>
            </Link>
            <Link to="/calendar" className={navLinkStyle("/calendar")}>
              <span className="relative">
                Calendar
                {isActive("/calendar") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full"></span>
                )}
              </span>
            </Link>
            {(user?.role === "Admin" || user?.role === "Manager") && (
              <Link to="/members" className={navLinkStyle("/members")}>
                <span className="relative">
                  {user?.role === "Admin" ? "Team Members" : "My Team"}
                  {isActive("/members") && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full"></span>
                  )}
                </span>
              </Link>
            )}
            <Link to="/profile" className={navLinkStyle("/profile")}>
              <span className="relative">
                Profile
                {isActive("/profile") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full"></span>
                )}
              </span>
            </Link>
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="text-white">
              <NotificationBell />
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={getAvatarUrl(user?.profilePicture, user?.name, 24)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-white/70 text-xs">{user?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6 transform rotate-180 transition-transform duration-200" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={getAvatarUrl(user?.profilePicture, user?.name, 40)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <Link to={dashboardLink} className={mobileLinkStyle(dashboardLink)}>
              Dashboard
            </Link>
            <Link to="/projects" className={mobileLinkStyle("/projects")}>
              Projects
            </Link>
            <Link to="/tasks" className={mobileLinkStyle("/tasks")}>
              Tasks
            </Link>
            <Link to="/calendar" className={mobileLinkStyle("/calendar")}>
              Calendar
            </Link>
            {(user?.role === "Admin" || user?.role === "Manager") && (
              <Link to="/members" className={mobileLinkStyle("/members")}>
                {user?.role === "Admin" ? "Team Members" : "My Team"}
              </Link>
            )}
            <Link to="/profile" className={mobileLinkStyle("/profile")}>
              Profile
            </Link>

            {/* Mobile Notification Bell */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="text-gray-700">
                <NotificationBell />
              </div>
            </div>

            {/* Mobile Logout */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all duration-200"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
