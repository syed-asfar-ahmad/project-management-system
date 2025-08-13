import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import { ShieldCheck, UserCircle, Briefcase, Users, Mail, Calendar, MapPin, Quote, Crown, ArrowUp, ArrowDown, ArrowLeft, X, Filter, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { getAvatarUrl } from "../utils/avatarUtils";

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [adminPage, setAdminPage] = useState(1);
  const [managerPage, setManagerPage] = useState(1);
  const [teamMemberPage, setTeamMemberPage] = useState(1);
  const [membersPerPage] = useState(6);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        let res;
        
        if (user?.role === "Admin") {
          // Admin gets all users
          res = await axios.get(`${API}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (user?.role === "Manager") {
          // Manager gets only their team members
          res = await axios.get(`${API}/users/my-team-members`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          // Other roles don't have access
          setLoading(false);
          return;
        }
        
        setMembers(res.data);
      } catch (err) {
        console.error('Error fetching members:', err);
        toast.error('Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [token, user]);

  const handleRoleUpdate = async (userId, newRole, memberName) => {
    // Show custom confirmation dialog
    setConfirmAction({
      userId,
      newRole,
      memberName,
      action: newRole === "Manager" ? "promote" : "demote"
    });
    setShowConfirmDialog(true);
  };

  const confirmRoleUpdate = async () => {
    if (!confirmAction) return;
    
    try {
      const response = await axios.put(
        `${API}/users/${confirmAction.userId}/role`,
        { newRole: confirmAction.newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success(`Role updated to ${confirmAction.newRole} successfully!`);
      
      // Refresh members list based on user role
      let res;
      if (user?.role === "Admin") {
        res = await axios.get(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (user?.role === "Manager") {
        res = await axios.get(`${API}/users/my-team-members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMembers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const cancelRoleUpdate = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  // Filter and search logic
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole ? member.role === filterRole : true;
    const matchesGender = filterGender ? member.gender === filterGender : true;
    
    return matchesSearch && matchesRole && matchesGender;
  });

  // Separate members by role
  const admins = filteredMembers.filter(member => member.role === "Admin");
  const managers = filteredMembers.filter(member => member.role === "Manager");
  const teamMembers = filteredMembers.filter(member => member.role === "Team Member");

  // Pagination logic for each section
  const getPaginatedMembers = (memberList, currentPage) => {
    const startIndex = (currentPage - 1) * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    return memberList.slice(startIndex, endIndex);
  };

  const getTotalPages = (memberList) => Math.ceil(memberList.length / membersPerPage);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterGender('');
    setAdminPage(1);
    setManagerPage(1);
    setTeamMemberPage(1);
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
            {user?.role === "Admin" 
              ? "Meet our amazing team of professionals dedicated to delivering excellence"
              : "Your team members working together to achieve project goals"
            }
          </p>
        </div>

            {/* Add Task Button and Filters Toggle Button on same line */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1"></div> {/* Spacer to push button to right */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 font-medium text-sm"
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-semibold text-gray-800">Filter Members</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Search Members"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />

                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer appearance-none relative text-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="" className="py-2 px-3 hover:bg-green-50">Filter by Role</option>
                    <option value="Admin" className="py-2 px-3 hover:bg-green-50">Admin</option>
                    <option value="Manager" className="py-2 px-3 hover:bg-green-50">Manager</option>
                    <option value="Team Member" className="py-2 px-3 hover:bg-green-50">Team Member</option>
                  </select>

                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer appearance-none relative text-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="" className="py-2 px-3 hover:bg-green-50">Filter by Gender</option>
                    <option value="Male" className="py-2 px-3 hover:bg-green-50">Male</option>
                    <option value="Female" className="py-2 px-3 hover:bg-green-50">Female</option>
                    <option value="Other" className="py-2 px-3 hover:bg-green-50">Other</option>
                  </select>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || filterRole || filterGender) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {searchTerm && (
                        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          Search: "{searchTerm}"
                          <button
                            onClick={() => setSearchTerm('')}
                            className="ml-1 hover:text-orange-900"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {filterRole && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Role: {filterRole}
                          <button
                            onClick={() => setFilterRole('')}
                            className="ml-1 hover:text-blue-900"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {filterGender && (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          Gender: {filterGender}
                          <button
                            onClick={() => setFilterGender('')}
                            className="ml-1 hover:text-purple-900"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

        {/* Admin Section */}
        {members.filter(member => member.role === "Admin").length > 0 && (
          <div className="mb-8">
            {!searchTerm && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Administrators</h2>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  {members.filter(member => member.role === "Admin").length} admin{members.filter(member => member.role === "Admin").length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
               {admins.map((member) => {
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
                            src={getAvatarUrl(member.profilePicture, member.name, 56)}
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
           </div>
         )}

        {/* Managers Section */}
        {members.filter(member => member.role === "Manager").length > 0 && (
          <div className="mb-8">
            {!searchTerm && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <Briefcase size={16} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Managers</h2>
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                  {members.filter(member => member.role === "Manager").length} manager{members.filter(member => member.role === "Manager").length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {getPaginatedMembers(managers, managerPage).map((member) => {
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
                            src={getAvatarUrl(member.profilePicture, member.name, 56)}
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

                      {/* Role Update Buttons - Only for Admin users */}
                      {user?.role === "Admin" && (
                        <div className="mt-3 pt-3 border-t border-white/30">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRoleUpdate(member._id, "Team Member", member.name)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                              title="Demote to Team Member"
                            >
                              <ArrowDown size={12} />
                              Demote
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
             
             {/* Managers Pagination */}
             {getTotalPages(managers) > 1 && (
               <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 mt-4">
                 <div className="flex items-center justify-between">
                   <div className="text-xs text-gray-600">
                     Showing {((managerPage - 1) * membersPerPage) + 1} to {Math.min(managerPage * membersPerPage, managers.length)} of {managers.length} managers
                   </div>
                   <div className="flex items-center gap-1">
                     <button
                       onClick={() => setManagerPage(managerPage - 1)}
                       disabled={managerPage === 1}
                       className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                         managerPage === 1
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                           : 'bg-green-100 text-green-700 hover:bg-green-200'
                       }`}
                     >
                       Previous
                     </button>
                     
                     <div className="flex items-center gap-1">
                       {Array.from({ length: getTotalPages(managers) }, (_, index) => index + 1).map((pageNumber) => (
                         <button
                           key={pageNumber}
                           onClick={() => setManagerPage(pageNumber)}
                           className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                             managerPage === pageNumber
                               ? 'bg-green-600 text-white'
                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                           }`}
                         >
                           {pageNumber}
                         </button>
                       ))}
                     </div>
                     
                     <button
                       onClick={() => setManagerPage(managerPage + 1)}
                       disabled={managerPage === getTotalPages(managers)}
                       className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                         managerPage === getTotalPages(managers)
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                           : 'bg-green-100 text-green-700 hover:bg-green-200'
                       }`}
                     >
                       Next
                     </button>
                   </div>
                 </div>
               </div>
             )}
           </div>
         )}

        {/* Team Members Section */}
        {members.filter(member => member.role === "Team Member").length > 0 && (
          <div className="mb-8">
            {!searchTerm && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <UserCircle size={16} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  {members.filter(member => member.role === "Team Member").length} member{members.filter(member => member.role === "Team Member").length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {getPaginatedMembers(teamMembers, teamMemberPage).map((member) => {
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
                            src={getAvatarUrl(member.profilePicture, member.name, 56)}
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

                      {/* Role Update Buttons - Only for Admin users */}
                      {user?.role === "Admin" && (
                        <div className="mt-3 pt-3 border-t border-white/30">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRoleUpdate(member._id, "Manager", member.name)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium"
                              title="Promote to Manager"
                            >
                              <ArrowUp size={12} />
                              Promote
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Team Members Pagination */}
             {getTotalPages(teamMembers) > 1 && (
               <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 mt-4">
                 <div className="flex items-center justify-between">
                   <div className="text-xs text-gray-600">
                     Showing {((teamMemberPage - 1) * membersPerPage) + 1} to {Math.min(teamMemberPage * membersPerPage, teamMembers.length)} of {teamMembers.length} team members
                   </div>
                   <div className="flex items-center gap-1">
                     <button
                       onClick={() => setTeamMemberPage(teamMemberPage - 1)}
                       disabled={teamMemberPage === 1}
                       className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                         teamMemberPage === 1
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                           : 'bg-green-100 text-green-700 hover:bg-green-200'
                       }`}
                     >
                       Previous
                     </button>
                     
                     <div className="flex items-center gap-1">
                       {Array.from({ length: getTotalPages(teamMembers) }, (_, index) => index + 1).map((pageNumber) => (
                         <button
                           key={pageNumber}
                           onClick={() => setTeamMemberPage(pageNumber)}
                           className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                             teamMemberPage === pageNumber
                               ? 'bg-green-600 text-white'
                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                           }`}
                         >
                           {pageNumber}
                         </button>
                       ))}
                     </div>
                     
                     <button
                       onClick={() => setTeamMemberPage(teamMemberPage + 1)}
                       disabled={teamMemberPage === getTotalPages(teamMembers)}
                       className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                         teamMemberPage === getTotalPages(teamMembers)
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                           : 'bg-green-100 text-green-700 hover:bg-green-200'
                       }`}
                     >
                       Next
                     </button>
                   </div>
                 </div>
               </div>
             )}
           </div>
         )}

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

      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            {/* Dialog Header */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                confirmAction.action === "promote" 
                  ? "bg-gradient-to-br from-green-400 to-green-600" 
                  : "bg-gradient-to-br from-red-400 to-red-600"
              }`}>
                {confirmAction.action === "promote" ? (
                  <ArrowUp size={20} className="text-white" />
                ) : (
                  <ArrowDown size={20} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {confirmAction.action === "promote" ? "Promote Member" : "Demote Member"}
                </h3>
                <p className="text-sm text-gray-600">
                  Confirm role change
                </p>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to <span className="font-semibold text-gray-800">
                  {confirmAction.action}
                </span>{" "}
                <span className="font-semibold text-green-600">
                  {confirmAction.memberName}
                </span>{" "}
                to <span className="font-semibold text-gray-800">
                  {confirmAction.newRole}
                </span>?
              </p>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                This action will change the member's permissions and access levels.
              </p>
            </div>

            {/* Dialog Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={cancelRoleUpdate}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleUpdate}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors ${
                  confirmAction.action === "promote"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                }`}
              >
                {confirmAction.action === "promote" ? "Promote" : "Demote"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AllMembersPage;
