import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import DashboardNavbar from '../components/AuthNavbar';
import { Trash2, PencilLine, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import BackButton from '../components/backButton';
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
  const [tasksPerPage] = useState(5);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUserId = queryParams.get('assignedTo') || '';

  const [filterUser, setFilterUser] = useState(initialUserId);

  const { token, user } = useAuth();
  const navigate = useNavigate();

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
        console.error('Failed to fetch tasks', err);
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
          console.log("API did not return array:", res.data);
          setTeamOptions([]); 
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
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
    ? tasks.filter((task) => {
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
      <BackButton />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-green-100">
            <CheckSquare size={32} className="text-green-600" />
                         <h1 className="text-3xl font-bold text-gray-800">
               {user?.role === 'Team Member' ? 'My Tasks' : 
                user?.role === 'Manager' ? 'Assigned Project Tasks' : 
                'All Tasks'}
             </h1>
          </div>
          <p className="mt-4 text-gray-600 text-lg">Manage and track your project tasks</p>
        </div>

                 {loading ? (
           /* Loading State */
           <div className="flex flex-col items-center justify-center py-20">
             <div className="relative">
               {/* Spinning Circle */}
               <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
               {/* Task Icon Overlay */}
               <div className="absolute inset-0 flex items-center justify-center">
                 <CheckSquare size={24} className="text-green-600" />
               </div>
             </div>
             <div className="mt-6 text-center">
               <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Tasks</h3>
               <p className="text-gray-600">Fetching your task list...</p>
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
             {/* Add Task Button - Moved to top */}
             {(user?.role === "Admin" || user?.role === "Manager") && (
               <div className="flex justify-end mb-6">
                 <Link
                   to="/add-task"
                   className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                 >
                   <CheckSquare size={20} />
                   Add New Task
                 </Link>
               </div>
             )}

                          {/* Filters */}
             <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-6">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                 <button
                   onClick={handleResetFilters}
                   className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Reset Filters
                 </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <input
                   type="text"
                   placeholder="Search tasks..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                 />

                                   <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer appearance-none relative"
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
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer appearance-none relative"
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
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer appearance-none relative"
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
             </div>

                         {/* Table for medium and larger screens */}
             <div className="hidden md:block bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
               <div className="overflow-auto">
                 <table className="w-full table-auto border-collapse">
                   <thead className="bg-gradient-to-r from-green-500 to-green-600">
                     <tr>
                       <th className="p-4 text-left text-white font-semibold">Title</th>
                       <th className="p-4 text-left text-white font-semibold">Status</th>
                       <th className="p-4 text-left text-white font-semibold">Priority</th>
                       <th className="p-4 text-left text-white font-semibold">Due Date</th>
                       <th className="p-4 text-left text-white font-semibold">Assigned To</th>
                       {user?.role !== 'Team Member' && <th className="p-4 text-left text-white font-semibold">Actions</th>}
                     </tr>
                   </thead>
                   <tbody>
                     {currentTasks.length === 0 ? (
                       <tr>
                         <td colSpan="6" className="p-8 text-center text-gray-500">
                           <div className="flex flex-col items-center">
                             <CheckSquare size={48} className="text-gray-300 mb-2" />
                             <p className="text-lg">No tasks found</p>
                             <p className="text-sm text-gray-400">Try adjusting your filters</p>
                           </div>
                         </td>
                       </tr>
                     ) : (
                       currentTasks.map((task) => (
                         <tr
                           key={task._id}
                           className="hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100"
                           onClick={() => navigate(`/tasks/${task._id}`)}
                         >
                           <td className="p-4 font-medium text-green-600 hover:text-green-800">
                             {task.title}
                           </td>
                           <td className="p-4">
                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                               {task.status}
                             </span>
                           </td>
                           <td className="p-4">
                             <div className="flex items-center gap-2">
                               {getPriorityIcon(task.priority)}
                               <span className="text-sm">{task.priority}</span>
                             </div>
                           </td>
                           <td className="p-4 text-sm text-gray-600">
                             {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                           </td>
                           <td className="p-4 text-sm text-gray-600">
                             {Array.isArray(task.assignedTo)
                               ? task.assignedTo.map((u) => u?.name).filter(Boolean).join(', ')
                               : 'N/A'}
                           </td>
                           {user?.role !== 'Team Member' && (
                             <td
                               className="p-4 flex items-center gap-3"
                               onClick={(e) => e.stopPropagation()}
                             >
                               <Link 
                                 to={`/tasks/${task._id}/edit`} 
                                 className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                               >
                                 <PencilLine size={18} />
                               </Link>
                               <button
                                 onClick={() => handleDelete(task._id)}
                                 className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                               >
                                 <Trash2 size={18} />
                               </button>
                             </td>
                           )}
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
             </div>

             {/* Pagination Controls */}
             {filteredTasks.length > 0 && (
               <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mt-6">
                 <div className="flex items-center justify-between">
                   <div className="text-sm text-gray-600">
                     Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, filteredTasks.length)} of {filteredTasks.length} tasks
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

                          {/* Card layout for small screens */}
             <div className="block md:hidden flex flex-col gap-4">
               {currentTasks.length === 0 ? (
                 <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 text-center">
                   <CheckSquare size={48} className="text-gray-300 mx-auto mb-4" />
                   <p className="text-lg text-gray-500">No tasks found</p>
                   <p className="text-sm text-gray-400">Try adjusting your filters</p>
                 </div>
               ) : (
                 currentTasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="bg-white p-6 rounded-xl shadow-lg border border-green-100 cursor-pointer hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-green-600">{task.title}</h3>
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(task.priority)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Due:</span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Assigned:</span> {Array.isArray(task.assignedTo)
                          ? task.assignedTo.map((u) => u?.name).filter(Boolean).join(', ')
                          : 'N/A'}
                      </p>
                    </div>
                    {user?.role !== 'Team Member' && (
                      <div
                        className="flex gap-4 mt-4 pt-3 border-t border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link 
                          to={`/tasks/${task._id}/edit`} 
                          className="flex items-center gap-2 text-green-600 hover:text-green-800 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"
                        >
                          <PencilLine size={16} />
                          <span className="text-sm">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                                 ))
               )}

               {/* Mobile Pagination Controls */}
               {filteredTasks.length > 0 && (
                 <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 mt-4">
                   <div className="flex flex-col items-center gap-4">
                     <div className="text-sm text-gray-600 text-center">
                       Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, filteredTasks.length)} of {filteredTasks.length} tasks
                     </div>
                     <div className="flex items-center gap-2">
                       <button
                         onClick={handlePrevPage}
                         disabled={currentPage === 1}
                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
             </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default TaskListPage;
