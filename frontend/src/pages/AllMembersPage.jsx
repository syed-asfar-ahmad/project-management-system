import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import { ShieldCheck, UserCircle, Briefcase, Users, Mail, Calendar, MapPin, Quote, Crown, ArrowUp, ArrowLeft } from "lucide-react";
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
  const navigate = useNavigate();
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
        <main className="flex-1 max-w-6xl mx-auto px-3 py-4">
          {/* Loading State - More Compact */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              {/* Spinning Circle */}
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              {/* Users Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Users size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Loading Team Members</h3>
              <p className="text-gray-600 text-sm">Fetching member information...</p>
            </div>
            {/* Loading Dots */}
            <div className="flex space-x-1 mt-3">
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
      
      <main className="flex-1 max-w-6xl mx-auto px-3 py-4">
        {/* Header with Back Button and Title - Responsive */}
        <div className="mb-4">
          {/* Back Button - Top Row on Mobile */}
          <div className="mb-3 md:hidden">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 font-medium text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
          
          {/* Desktop Layout - Back Button and Title on Same Line */}
          <div className="hidden md:flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 font-medium text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                Team Members
              </h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer to center the title */}
          </div>
          
          {/* Mobile Layout - Centered Title */}
          <div className="md:hidden text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                Team Members
              </h1>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-3">
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Meet our amazing team of professionals dedicated to delivering excellence
          </p>
        </div>
          <div className="flex justify-center space-x-3 mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((member) => {
            const roleColor = roleColors[member.role];
            return (
              <div
                key={member._id}
                className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${roleColor.bg} ${roleColor.border} border-2`}
              >


                {/* Card Content - More Compact */}
                <div className="relative p-4">
                  {/* Profile Image and Basic Info Row */}
                  <div className="flex items-center mb-3">
                    <div className="relative mr-3">
                      <img
                        src={
                          member.profilePicture
                            ? member.profilePicture
                            : "https://via.placeholder.com/64x64?text=" + member.name.charAt(0).toUpperCase()
                        }
                        alt={member.name}
                        className="relative w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg transition-transform duration-300"
                      />
                      
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-gray-800 mb-1 transition-colors duration-300 truncate">
                        {member.name}
                      </h2>
                      <div className="flex items-center space-x-1 mb-2">
                        <Mail size={12} className="text-gray-500 flex-shrink-0" />
                        <p className="text-xs text-gray-600 font-medium truncate">{member.email}</p>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full ${roleColor.badge} font-semibold text-xs shadow-sm`}>
                        {roleIcons[member.role]}
                        {member.role}
                      </div>
                    </div>
                  </div>

                  {/* Member Details - Compact Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {member.position && (
                      <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                        <MapPin size={12} className="text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Position</p>
                          <p className="text-xs font-semibold text-gray-700 truncate">{member.position}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.gender && (
                      <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                        <UserCircle size={12} className="text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Gender</p>
                          <p className="text-xs font-semibold text-gray-700 capitalize">{member.gender}</p>
                        </div>
                      </div>
                    )}
                    
                    {member.dateOfBirth && (
                      <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm col-span-2">
                        <Calendar size={12} className="text-gray-500 flex-shrink-0" />
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
                    <div className="relative p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                      <Quote size={10} className="absolute top-1 left-1 text-gray-400" />
                      <blockquote className="text-xs text-gray-700 italic pl-3">
                        "{member.bio}"
                      </blockquote>
                    </div>
                  )}

                  {/* Role Management - Admin Only */}
                  {user?.role === "Admin" && member._id !== user._id && (
                    <div className="mt-3 pt-3 border-t border-white/30 relative z-10">
                      <div className="flex flex-wrap gap-2">
                        {member.role === "Team Member" && (
                          <button
                            onClick={() => handleRoleUpdate(member._id, "Manager")}
                            className="inline-flex items-center px-2 py-1 bg-amber-500 text-white rounded-full text-xs font-medium hover:bg-amber-600 transition-colors duration-200 cursor-pointer relative z-20"
                          >
                            <ArrowUp size={10} className="mr-1" />
                            Promote to Manager
                          </button>
                        )}
                        {member.role === "Manager" && (
                          <button
                            onClick={() => handleRoleUpdate(member._id, "Team Member")}
                            className="inline-flex items-center px-2 py-1 bg-gray-500 text-white rounded-full text-xs font-medium hover:bg-gray-600 transition-colors duration-200 cursor-pointer relative z-20"
                          >
                            <ArrowUp size={10} className="mr-1 rotate-180" />
                            Demote to Team Member
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special Note for Main Admin */}
                  {member.email === "ahmad@example.com" && (
                    <div className="mt-3 pt-3 border-t border-white/30">
                      <div className="text-center">
                        <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-medium">
                          <Crown size={10} className="mr-1" />
                          Main Admin
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Primary administrator account</p>
                      </div>
                    </div>
                  )}


                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State - More Compact */}
        {members.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No Team Members Found</h3>
            <p className="text-gray-600 text-sm">There are currently no team members to display.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AllMembersPage;
