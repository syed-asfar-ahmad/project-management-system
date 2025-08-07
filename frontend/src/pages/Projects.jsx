import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllProjects } from "../services/projectService";
import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";
import BackButton from "../components/backButton";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { Briefcase, Calendar, Users, ArrowRight } from 'lucide-react';

function Projects() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProjects(token);
      // Filter projects for Team Members and Managers to only show assigned ones
      if (user?.role === "Team Member") {
        const assignedProjects = res.data.filter(project => 
          project.teamMembers?.some(member => 
            typeof member === "string" ? member === user._id : member._id === user._id
          )
        );
        setProjects(assignedProjects);
      } else if (user?.role === "Manager") {
        const assignedProjects = res.data.filter(project => 
          project.teamMembers?.some(member => 
            typeof member === "string" ? member === user._id : member._id === user._id
          ) || 
          (project.projectManager && 
           (typeof project.projectManager === "string" ? 
            project.projectManager === user._id : 
            project.projectManager._id === user._id))
        );
        setProjects(assignedProjects);
      } else {
        setProjects(res.data);
      }
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
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

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
      <BackButton />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-green-100">
            <Briefcase size={32} className="text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.role === "Team Member" ? "My Projects" : user?.role === "Manager" ? "Assigned Projects" : "All Projects"}
            </h1>
          </div>
          <p className="mt-4 text-gray-600 text-lg">Manage and track your project portfolio</p>
        </div>

        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              {/* Spinning Circle */}
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              {/* Project Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Projects</h3>
              <p className="text-gray-600">Fetching your project list...</p>
            </div>
            {/* Loading Dots */}
            <div className="flex space-x-2 mt-4">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          <>
                         {/* Create Project Button - Moved to top */}
             {user?.role === "Admin" && (
               <div className="flex justify-end mb-6">
                 <Link
                   to="/projects/create"
                   className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                 >
                   <Briefcase size={20} />
                   Create New Project
                 </Link>
               </div>
             )}

            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
                <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
                                 <p className="text-gray-600 mb-4">
                   {user?.role === "Admin" ? "Get started by creating your first project" : 
                    user?.role === "Manager" ? "No projects have been assigned to you yet" : 
                    "No projects found"}
                 </p>
                 {user?.role === "Admin" && (
                   <Link
                     to="/projects/create"
                     className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                   >
                     <Briefcase size={18} />
                     Create Project
                   </Link>
                 )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentProjects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <Link
                              to={`/projects/${project._id}`}
                              className="group-hover:text-green-800 transition-colors"
                            >
                              <h2 className="text-xl font-bold text-green-700 group-hover:text-green-800 transition-colors cursor-pointer">
                                {project.name}
                              </h2>
                            </Link>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} ml-4`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={16} className="text-green-500" />
                              <span className="font-medium">Due:</span>
                              <span>{project.deadline?.slice(0, 10) || "N/A"}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users size={16} className="text-green-500" />
                              <span className="font-medium">Team:</span>
                              <span>{project.teamMembers?.length || 0} members</span>
                            </div>
                          </div>
                          
                          <Link
                            to={`/projects/${project._id}`}
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                          >
                            <span>View Details</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {projects.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
