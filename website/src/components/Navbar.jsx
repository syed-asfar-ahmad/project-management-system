import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const linkClass = (path) =>
    `${location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:text-blue-600 transition`;

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600 tracking-tight">
          <Link to="/">TaskPilot</Link>
        </div>

        <div className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/features" className={linkClass('/features')}>Features</Link>
          <Link to="/about" className={linkClass('/about')}>About</Link>
          <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
        </div>

        <div className="hidden md:flex space-x-3">
          <a href="/login" className="px-4 py-2 text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-50 transition">
            Login
          </a>
          <a href="/signup" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
            Sign Up
          </a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-700 focus:outline-none">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="flex flex-col space-y-3 font-medium">
            <Link to="/" onClick={() => setMobileOpen(false)} className={linkClass('/')}>Home</Link>
            <Link to="/features" onClick={() => setMobileOpen(false)} className={linkClass('/features')}>Features</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className={linkClass('/about')}>About</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className={linkClass('/contact')}>Contact</Link>
            <a href="/login" className="mt-3 px-4 py-2 text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-50 transition">
              Login
            </a>
            <a href="/signup" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
              Sign Up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
