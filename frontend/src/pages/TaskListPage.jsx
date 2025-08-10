import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import DashboardNavbar from '../components/AuthNavbar';
import { Trash2, PencilLine, CheckSquare, Clock, AlertCircle, Filter, X, ChevronDown, ArrowLeft } from 'lucide-react';

import { toast } from 'react-toastify';


const API = process.env.REACT_APP_API_BASE_URL;

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUserId = queryParams.get('assignedTo') || '';

  const [filterUser, setFilterUser] = useState(initialUserId);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        let url;
        if (user?.role === 'Team Member') {
          url = `${API}/tasks/my-tasks`;
        } else if (user?.role === 'Manager') {
          url = `${API}/tasks/manager-tasks`;
        } else {
          url = `${API}/tasks`;
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (token && user) fetchTasks();
  }, [token, user]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPriority, filterUser, searchTerm]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${API}/users/team-members`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setTeamOptions(res.data);
        } else {
    
          setTeamOptions([]); 
        }
      } catch (err) {
        setTeamOptions([]); 
      }
    };
    fetchTeam();
  }, [token]);


  const handleDelete = (taskId) => {
  toast.info(
    ({ closeToast }) => (
      <div>
        <p className="font-semibold text-gray-800 mb-2">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={async () => {
              closeToast();
              try {
                await axios.delete(`${API}/tasks/${taskId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Task deleted successfully!");
                navigate("/tasks"); // Or refresh task list if you're already on same page
              } catch (err) {
                toast.error("Failed to delete task");
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={closeToast}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeButton: false,
      draggable: false,
      closeOnClick: false,
    }
  );
};

  const filteredTasks = Array.isArray(tasks)
    ? tasks
        .filter((task) => {
        const matchesStatus = filterStatus ? task.status === filterStatus : true;
        const matchesPriority = filterPriority ? task.priority === filterPriority : true;
        const matchesUser =
          filterUser && Array.isArray(task.assignedTo)
            ? task.assignedTo.some((u) => u?._id === filterUser)
            : true;
        const matchesSearch =
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesPriority && matchesUser && matchesSearch;
      })
        .sort((a, b) => {
          // Sort by creation date (newest first) - assuming tasks have createdAt field
          // If createdAt doesn't exist, fall back to _id (which often contains timestamp)
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a._id);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b._id);
          return dateB - dateA;
        })
    : [];

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Low':
        return <CheckSquare className="w-4 h-4 text-green-500" />;
      default:
        return <CheckSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

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

  const handleResetFilters = () => {
    setFilterStatus('');
    setFilterPriority('');
    setFilterUser('');
    setSearchTerm('');
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <style>
        {`
          select option {
            padding: 8px 12px;
            background-color: white;
            color: #374151;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          select option:hover {
            background-color: #f0fdf4;
          }
          
          select option:checked {
            background-color: #dcfce7;
            color: #166534;
            font-weight: 500;
          }
          
          select:focus option:checked {
            background-color: #bbf7d0;
          }
        `}
      </style>
      <DashboardNavbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6">
                 {loading ? (
           /* Loading State */
          <div className="flex flex-col items-center justify-center py-16">
             <div className="relative">
               {/* Spinning Circle */}
              <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
               {/* Task Icon Overlay */}
               <div className="absolute inset-0 flex items-center justify-center">
                <CheckSquare size={20} className="text-green-600" />
               </div>
             </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Tasks</h3>
              <p className="text-gray-600 text-sm">Fetching your task list...</p>
             </div>
             {/* Loading Dots */}
            <div className="flex space-x-2 mt-3">
               <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
               <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                    <CheckSquare size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                    {user?.role === 'Team Member' ? 'My Tasks' : 
                     user?.role === 'Manager' ? 'Assigned Project Tasks' : 
                     'All Tasks'}
                  </h1>
                </div>
                
                <div className="w-20"></div> {/* Spacer to center the title */}
              </div>
              
              {/* Mobile Layout - Centered Title */}
              <div className="md:hidden text-center">
                <div className="inline-flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center">
                    <CheckSquare size={20} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                   {user?.role === 'Team Member' ? 'My Tasks' : 
                    user?.role === 'Manager' ? 'Assigned Project Tasks' : 
                    'All Tasks'}
                 </h1>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-3">
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Manage and track your project tasks
              </p>
            </div>

            {/* Add Task Button and Filters Toggle Button on same line */}
            <div className="flex justify-between items-center mb-4">
             {(user?.role === "Admin" || user?.role === "Manager") && (
                 <Link
                   to="/add-task"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                 >
                  <CheckSquare size={18} />
                   Add New Task
                 </Link>
              )}
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
                  <h3 className="text-base font-semibold text-gray-800">Filter Tasks</h3>
                 <button
                   onClick={handleResetFilters}
                    className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
                 >
                   Reset Filters
                 </button>
               </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                 <input
                   type="text"
                    placeholder="search task"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                 />

                                   <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer appearance-none relative text-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="" className="py-2 px-3 hover:bg-green-50">Filter by Status</option>
                    <option value="To Do" className="py-2 px-3 hover:bg-green-50">To Do</option>
                    <option value="In Progress" className="py-2 px-3 hover:bg-green-50">In Progress</option>
                    <option value="Completed" className="py-2 px-3 hover:bg-green-50">Completed</option>
                  </select>

                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer appearance-none relative text-sm"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="" className="py-2 px-3 hover:bg-green-50">Filter by Priority</option>
                    <option value="Low" className="py-2 px-3 hover:bg-green-50">Low</option>
                    <option value="Medium" className="py-2 px-3 hover:bg-green-50">Medium</option>
                    <option value="High" className="py-2 px-3 hover:bg-green-50">High</option>
                  </select>

                  {user?.role !== 'Team Member' && (
                    <select
                      value={filterUser}
                      onChange={(e) => setFilterUser(e.target.value)}
                      className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer appearance-none relative text-sm"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="" className="py-2 px-3 hover:bg-green-50">Filter by User</option>
                      {Array.isArray(teamOptions) &&
                        teamOptions.map((user) => (
                          <option key={user._id} value={user._id} className="py-2 px-3 hover:bg-green-50">
                            {user.name}
                          </option>
                      ))}
                    </select>
                  )}
             </div>

                {/* Active Filters Display */}
                {(filterStatus || filterPriority || filterUser || searchTerm) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {filterStatus && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Status: {filterStatus}
                               <button
                            onClick={() => setFilterStatus('')}
                            className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                               >
                            <X size={12} />
                               </button>
                        </span>
                      )}
                      {filterPriority && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Priority: {filterPriority}
                     <button
                            onClick={() => setFilterPriority('')}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                     </button>
                        </span>
                      )}
                      {filterUser && (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          User: {teamOptions.find(u => u._id === filterUser)?.name || 'Unknown'}
                         <button
                            onClick={() => setFilterUser('')}
                            className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                         </button>
                        </span>
                  )}
                                             {searchTerm && (
                         <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                           Search: "{searchTerm}"
                     <button
                             onClick={() => setSearchTerm('')}
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

            {/* Task Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {currentTasks.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl shadow-lg border border-green-100 p-6 text-center">
                  <CheckSquare size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-base text-gray-500">No tasks found</p>
                   <p className="text-sm text-gray-400">Try adjusting your filters</p>
                 </div>
               ) : (
                 currentTasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="bg-white p-4 rounded-xl shadow-lg border border-green-100 cursor-pointer hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-semibold text-green-600 truncate pr-2">{task.title}</h3>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {/* Project Name */}
                      {task.project && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="font-medium">Project:</span>
                          <span className="truncate text-blue-600 font-medium">
                            {task.project.name || 'N/A'}
                          </span>
                      </div>
                      )}
                      
                      {/* Description */}
                      {task.description && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Description:</span>
                          <p className="mt-1 line-clamp-2 text-gray-500">
                            {task.description}
                          </p>
                    </div>
                      )}
                      
                                             {/* Status and Due Date on first line */}
                      <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Due:</span>
                          <span className={task.dueDate ? 'text-red-600 font-medium' : 'text-gray-500'}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Team Member and Priority on second line */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Team Member:</span>
                          <span className="truncate">
                            {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                          ? task.assignedTo.map((u) => u?.name).filter(Boolean).join(', ')
                              : 'Not Assigned'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Priority:</span>
                          <span className={`font-medium ${
                            task.priority === 'High' ? 'text-red-600' : 
                            task.priority === 'Medium' ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {user?.role !== 'Team Member' && (
                      <div
                        className="flex gap-3 mt-3 pt-2 border-t border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link 
                          to={`/tasks/${task._id}/edit`} 
                          className="flex items-center gap-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <PencilLine size={14} />
                          <span className="text-xs">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                          <span className="text-xs">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                                 ))
               )}
            </div>

            {/* Pagination Controls */}
               {filteredTasks.length > 0 && (
                 <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-gray-600 text-center sm:text-left">
                       Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, filteredTasks.length)} of {filteredTasks.length} tasks
                     </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-end">
                       <button
                         onClick={handlePrevPage}
                         disabled={currentPage === 1}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
      </main>

      <Footer />
    </div>
  );
}

export default TaskListPage;
