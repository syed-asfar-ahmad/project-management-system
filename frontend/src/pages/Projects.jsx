import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProjects } from "../services/projectService";
import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";

import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { Briefcase, Calendar, Users, ArrowRight, Filter, X, ChevronDown, ArrowLeft } from 'lucide-react';
import axios from "axios";

const API = process.env.REACT_APP_API_BASE_URL || 'https://taskpilot-o3bm.onrender.com/api';

function Projects() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    manager: '',
    searchTerm: ''
  });
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProjects(token);
      let filteredProjects = [];
      
      // Filter projects for Team Members and Managers to only show assigned ones
      if (user?.role === "Team Member") {
        filteredProjects = res.data.filter(project => 
          project.teamMembers?.some(member => 
            typeof member === "string" ? member === user._id : member._id === user._id
          )
        );
      } else if (user?.role === "Manager") {
        filteredProjects = res.data.filter(project => 
          project.teamMembers?.some(member => 
            typeof member === "string" ? member === user._id : member._id === user._id
          ) || 
          (project.projectManager && 
           (typeof project.projectManager === "string" ? 
            project.projectManager === user._id : 
            project.projectManager._id === user._id))
        );
      } else {
        filteredProjects = res.data;
      }
      
      // Sort projects by creation date (most recent first)
      filteredProjects.sort((a, b) => {
        const dateA = new Date(a.createdAt || a._id);
        const dateB = new Date(b.createdAt || b._id);
        return dateB - dateA; // Most recent first
      });
      
      setProjects(filteredProjects);
      setFilteredProjects(filteredProjects);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [token, user?.role, user?._id]);

  useEffect(() => {
    if (token && user) {
      loadProjects();
    }
  }, [token, user, loadProjects]);

  // Fetch managers for filter
  const fetchManagers = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/users/managers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(response.data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchManagers();
    }
  }, [fetchManagers]);

  // Apply filters
  useEffect(() => {
    let filtered = [...projects];
    
    // Status filter
    if (filters.status) {
      filtered = filtered.filter(project => 
        project.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Date range filter
    if (filters.dateRange) {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(project => {
        const projectDate = new Date(project.createdAt || project._id);
        switch (filters.dateRange) {
          case 'last7days':
            return projectDate >= sevenDaysAgo;
          case 'last30days':
            return projectDate >= thirtyDaysAgo;
          case 'thisMonth':
            return projectDate.getMonth() === today.getMonth() && 
                   projectDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    }
    
    // Manager filter
    if (filters.manager) {
      filtered = filtered.filter(project => {
        if (filters.manager === 'not_assigned') {
          return !project.projectManager || !project.projectManager._id;
        }
        return project.projectManager?._id === filters.manager;
      });
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [projects, filters]);

  const clearFilters = () => {
    setFilters({
      status: '',
      dateRange: '',
      manager: '',
      searchTerm: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on hold':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <AuthNavbar />
      <main className="flex-1 max-w-7xl mx-auto px-3 py-4">
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              {/* Spinning Circle */}
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              {/* Project Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Loading Projects</h3>
              <p className="text-gray-600 text-sm">Fetching your project list...</p>
            </div>
            {/* Loading Dots */}
            <div className="flex space-x-1 mt-3">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          <>
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
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                    {user?.role === "Team Member" ? "My Projects" : user?.role === "Manager" ? "Assigned Projects" : "All Projects"}
                  </h1>
                </div>
                
                <div className="w-20"></div> {/* Spacer to center the title */}
              </div>
              
              {/* Mobile Layout - Centered Title */}
              <div className="md:hidden text-center">
                <div className="inline-flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                    {user?.role === "Team Member" ? "My Projects" : user?.role === "Manager" ? "Assigned Projects" : "All Projects"}
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-3">
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Manage and track your project portfolio
              </p>
            </div>

            {/* Create Project Button and Filter Button Row */}
            <div className="flex justify-between items-center mb-4">
              {user?.role === "Admin" && (
                <Link
                  to="/projects/create"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                >
                  <Briefcase size={18} />
                  Create New Project
                </Link>
              )}
              
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 font-medium text-sm"
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Filter Projects</h3>
                                       <button
                       onClick={clearFilters}
                       className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                     >
                       Reset Filters
                     </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Term */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      placeholder="search project"
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Time</option>
                      <option value="last7days">Last 7 Days</option>
                      <option value="last30days">Last 30 Days</option>
                      <option value="thisMonth">This Month</option>
                    </select>
                  </div>
                  
                  {/* Manager Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                    <select
                      value={filters.manager}
                      onChange={(e) => setFilters({...filters, manager: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="not_assigned">Not Assigned</option>
                      {managers.map((manager) => (
                        <option key={manager._id} value={manager._id}>
                          {manager.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Active Filters Display */}
                {(filters.status || filters.dateRange || filters.manager || filters.searchTerm) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {filters.status && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Status: {filters.status}
                          <button
                            onClick={() => setFilters({...filters, status: ''})}
                            className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {filters.dateRange && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Date: {filters.dateRange.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          <button
                            onClick={() => setFilters({...filters, dateRange: ''})}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {filters.manager && (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          Manager: {filters.manager === 'not_assigned' ? 'Not Assigned' : managers.find(m => m._id === filters.manager)?.name || 'Unknown'}
                          <button
                            onClick={() => setFilters({...filters, manager: ''})}
                            className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      )}
                      {filters.searchTerm && (
                        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          Search: "{filters.searchTerm}"
                          <button
                            onClick={() => setFilters({...filters, searchTerm: ''})}
                            className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
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

            

            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 text-center">
                <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {projects.length === 0 ? "No Projects Found" : "No Projects Match Filters"}
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {projects.length === 0 ? 
                    (user?.role === "Admin" ? "Get started by creating your first project" : 
                     user?.role === "Manager" ? "No projects have been assigned to you yet" : 
                     "No projects found") :
                    "Try adjusting your filters or clear them to see all projects"
                  }
                </p>
                {projects.length === 0 && user?.role === "Admin" && (
                  <Link
                    to="/projects/create"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <Briefcase size={16} />
                    Create Project
                  </Link>
                )}
                {projects.length > 0 && (
                                       <button
                       onClick={clearFilters}
                       className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                     >
                       Reset Filters
                     </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProjects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/projects/${project._id}`}
                              className="group-hover:text-green-800 transition-colors"
                            >
                              <h2 className="text-base font-bold text-green-700 group-hover:text-green-800 transition-colors cursor-pointer truncate">
                                {project.name}
                              </h2>
                            </Link>
                            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{project.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} ml-3 flex-shrink-0`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex items-center gap-3 overflow-x-auto">
                              <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                                <Calendar size={14} className="text-green-500" />
                                <span className="font-medium">Due:</span>
                                <span>{project.deadline?.slice(0, 10) || "N/A"}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                                <Users size={14} className="text-green-500" />
                                <span className="font-medium">Team:</span>
                                <span>{project.teamMembers?.length || 0} members</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                              <Briefcase size={14} className="text-green-500" />
                              <span className="font-medium">Manager:</span>
                              <span>{project.projectManager?.name || "Not Assigned"}</span>
                            </div>
                          </div>
                          
                          <Link
                            to={`/projects/${project._id}`}
                            className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium text-xs shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                          >
                            <span>View Details</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {filteredProjects.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, filteredProjects.length)} of {filteredProjects.length} projects
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          Previous
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                            currentPage === totalPages
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
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Projects;