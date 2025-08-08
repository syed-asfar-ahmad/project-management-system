import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import { ShieldCheck, UserCircle, Briefcase, Users, Mail, Calendar, MapPin, Quote, Crown, ArrowUp } from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_BASE_URL || 'https://taskpilot-o3bm.onrender.com/api';

const roleIcons = {
  Admin: <ShieldCheck className="inline-block w-4 h-4 text-red-500 mr-1" />,
  Manager: <Briefcase className="inline-block w-4 h-4 text-amber-500 mr-1" />,
  "Team Member": <UserCircle className="inline-block w-4 h-4 text-green-500 mr-1" />,
};

const roleColors = {
  Admin: {
    bg: "bg-gradient-to-br from-red-50 to-red-100",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700"
  },
  Manager: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700"
  },
  "Team Member": {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700"
  }
};

function AllMembersPage() {
  const { token, user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "Admin") {
      fetchMembers();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const response = await axios.put(
        `${API}/users/${userId}/role`,
        { newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success(`Role updated to ${newRole} successfully!`);
      
      // Refresh members list
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
        <AuthNavbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          {/* Loading State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              {/* Spinning Circle */}
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              {/* Users Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Team Members</h3>
              <p className="text-gray-600">Fetching member information...</p>
            </div>
            {/* Loading Dots */}
            <div className="flex space-x-2 mt-4">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <AuthNavbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4 shadow-lg">
            <Users size={24} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent mb-3">
            Team Members
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Meet our amazing team of professionals dedicated to delivering excellence
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Admin</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Manager</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Team Member</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {members.map((member) => {
            const roleColor = roleColors[member.role];
            return (
              <div
                key={member._id}
                className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${roleColor.bg} ${roleColor.border} border-2`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-current to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-current to-transparent rounded-full translate-y-8 -translate-x-8"></div>
                </div>

                {/* Card Content */}
                <div className="relative p-6">
                  {/* Profile Image and Basic Info Row */}
                  <div className="flex items-center mb-4">
                    <div className="relative mr-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img
                        src={
                          member.profilePicture
                            ? member.profilePicture
                            : "https://via.placeholder.com/80x80?text=" + member.name.charAt(0).toUpperCase()
                        }
                        alt={member.name}
                        className="relative w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        {roleIcons[member.role]}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors duration-300 truncate">
                        {member.name}
                      </h2>
                      <div className="flex items-center space-x-1 mb-2">
                        <Mail size={14} className="text-gray-500 flex-shrink-0" />
                        <p className="text-xs text-gray-600 font-medium truncate">{member.email}</p>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full ${roleColor.badge} font-semibold text-xs shadow-sm`}>
                        {roleIcons[member.role]}
                        {member.role}
                      </div>
                    </div>
                  </div>

                  {/* Member Details - Compact Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {member.position && (
                      <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                        <MapPin size={14} className="text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Position</p>
                          <p className="text-xs font-semibold text-gray-700 truncate">{member.position}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.gender && (
                      <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                        <UserCircle size={14} className="text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Gender</p>
                          <p className="text-xs font-semibold text-gray-700 capitalize">{member.gender}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.dateOfBirth && (
                      <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm col-span-2">
                        <Calendar size={14} className="text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                          <p className="text-xs font-semibold text-gray-700">
                            {new Date(member.dateOfBirth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bio Section - Only if exists */}
                  {member.bio && (
                    <div className="relative p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                      <Quote size={12} className="absolute top-2 left-2 text-gray-400" />
                      <blockquote className="text-xs text-gray-700 italic pl-4">
                        "{member.bio}"
                      </blockquote>
                    </div>
                  )}

                  {/* Role Management - Admin Only */}
                  {user?.role === "Admin" && member._id !== user._id && (
                    <div className="mt-4 pt-4 border-t border-white/30 relative z-10">
                      <div className="flex flex-wrap gap-2">
                        {member.role === "Team Member" && (
                          <button
                            onClick={() => handleRoleUpdate(member._id, "Manager")}
                            className="inline-flex items-center px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-medium hover:bg-amber-600 transition-colors duration-200 cursor-pointer relative z-20"
                          >
                            <ArrowUp size={12} className="mr-1" />
                            Promote to Manager
                          </button>
                        )}
                        {member.role === "Manager" && (
                          <button
                            onClick={() => handleRoleUpdate(member._id, "Team Member")}
                            className="inline-flex items-center px-3 py-1 bg-gray-500 text-white rounded-full text-xs font-medium hover:bg-gray-600 transition-colors duration-200 cursor-pointer relative z-20"
                          >
                            <ArrowUp size={12} className="mr-1 rotate-180" />
                            Demote to Team Member
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special Note for Main Admin */}
                  {member.email === "ahmad@example.com" && (
                    <div className="mt-4 pt-4 border-t border-white/30">
                      <div className="text-center">
                        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-medium">
                          <Crown size={12} className="mr-1" />
                          Main Admin
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Primary administrator account</p>
                      </div>
                    </div>
                  )}

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {members.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Team Members Found</h3>
            <p className="text-gray-600">There are currently no team members to display.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AllMembersPage;
