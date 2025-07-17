import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">TaskPilot</h3>
          <p className="text-gray-400">
            The all-in-one platform to manage your projects, teams, and tasks efficiently.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2">
            <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            <li><Link to="/projects" className="hover:text-white transition">Projects</Link></li>
            <li><Link to="/tasks" className="hover:text-white transition">Tasks</Link></li>
            <li><Link to="/calendar" className="hover:text-white transition">Calendar</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2">
            <li>Email: support@taskpilot.com</li>
            <li>Phone: +1 (234) 567-8901</li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Instagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Facebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Twitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} TaskPilot. All rights reserved.
      </div>
    </footer>
  );
}
