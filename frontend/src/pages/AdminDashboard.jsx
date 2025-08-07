import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import { toast } from 'react-hot-toast'; 
import UserProfileWidget from "../components/UserProfileWidget";

import {
  BarChart,
  FilePlus,
  ListTodo,
  Users,
  PlusCircle,
  ClipboardList,
  Briefcase,
  Calendar,
  ArrowRight,
  CheckSquare,
  Mail,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const API = process.env.REACT_APP_API_BASE_URL || 'https://taskpilot-o3bm.onrender.com/api';

function AdminDashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [contactCount, setContactCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentProjectsPage, setCurrentProjectsPage] = useState(1);
  const [currentTasksPage, setCurrentTasksPage] = useState(1);
  const [projectsPerPage] = useState(4);
  const [tasksPerPage] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projRes, taskRes, memberRes, contactRes] = await Promise.all([
          axios.get(`${API}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/users/team-members`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/contact/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProjects(projRes.data);
        setTasks(taskRes.data);
        setMembers(memberRes.data);
        setContactCount(contactRes.data.length);
      } catch (err) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Pagination logic for projects
  const indexOfLastProject = currentProjectsPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalProjectsPages = Math.ceil(projects.length / projectsPerPage);

  // Pagination logic for tasks
  const indexOfLastTask = currentTasksPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalTasksPages = Math.ceil(tasks.length / tasksPerPage);

  const handleProjectsPageChange = (pageNumber) => {
    setCurrentProjectsPage(pageNumber);
  };

  const handleTasksPageChange = (pageNumber) => {
    setCurrentTasksPage(pageNumber);
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

  const getTaskStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'to do':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Task Status Counts
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { "To Do": 0, "In Progress": 0, Completed: 0 }
  );

  const taskStatusData = {
    labels: ["To Do", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks by Status",
        data: [
          statusCounts["To Do"],
          statusCounts["In Progress"],
          statusCounts["Completed"],
        ],
        backgroundColor: ["#facc15", "#38bdf8", "#4ade80"],
        borderWidth: 1,
      },
    ],
  };

  // Correct task count logic for assignedTo (which is an array)
  const getTaskCount = (memberId) => {
    return tasks.filter((task) => {
      const assignedList = task.assignedTo;
      if (!Array.isArray(assignedList)) return false;

      return assignedList.some(
        (assigned) => assigned === memberId || assigned._id === memberId
      );
    }).length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-green-100">
            <BarChart size={32} className="text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <p className="mt-4 text-gray-600 text-lg">Monitor and manage your project ecosystem</p>
        </div>

        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              {/* Spinning Circle */}
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              {/* Dashboard Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard</h3>
              <p className="text-gray-600">Fetching your project data...</p>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-3xl font-bold text-gray-800">{projects.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardList size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-3xl font-bold text-gray-800">{members.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                <div className="flex items-center justify-between">
                                     <div>
                     <p className="text-sm font-medium text-gray-600">Contact Messages</p>
                     <p className="text-3xl font-bold text-gray-800">{contactCount}</p>
                   </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Mail size={24} className="text-orange-600" />
                  </div>
                </div>
                <Link
                  to="/contact-messages"
                  className="mt-4 inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg w-full justify-center"
                >
                  <Mail size={16} />
                  View Messages
                </Link>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 md:h-[360px] h-[280px] flex flex-col overflow-hidden">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <ClipboardList size={20} className="text-green-600" /> Task Status Overview
                </h2>
                <div className="flex-grow relative">
                  <Pie
                    data={taskStatusData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            boxWidth: 12,
                            padding: 15,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Task counts per team member (list) */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 h-[360px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={20} className="text-green-600" /> Team Members & Their Tasks
                  </h2>
                  <Link
                    to="/members"
                    className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    View All
                  </Link>
                </div>

                <ul className="space-y-3 text-sm text-gray-700">
                  {members.map((member) => {
                    const count = getTaskCount(member._id);
                    return (
                      <li
                        key={member._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <span className="font-medium">{member.name}</span>
                        <Link
                          to={`/tasks?assignedTo=${member._id}`}
                          className="text-green-600 hover:text-green-800 font-medium bg-green-100 px-3 py-1 rounded-full text-xs hover:bg-green-200 transition-colors"
                        >
                          {count} task{count !== 1 ? "s" : ""}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

                    {/* Projects Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-lg border border-green-100">
                <Briefcase size={24} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">All Projects</h2>
            </div>
            <Link
              to="/projects/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              <FilePlus size={20} />
              Add Project
            </Link>
          </div>
              
                        {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
              <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first project</p>
              <Link
                to="/projects/create"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <FilePlus size={18} />
                Create Project
              </Link>
            </div>
          ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
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
                                <h3 className="text-xl font-bold text-green-700 group-hover:text-green-800 transition-colors cursor-pointer">
                                  {project.name}
                                </h3>
                              </Link>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} ml-4`}>
                              {project.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar size={16} className="text-green-500" />
                                <span className="font-medium">Deadline:</span>
                                <span>{project.deadline?.slice(0, 10) || "N/A"}</span>
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

                  {/* Projects Pagination */}
                  {projects.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mt-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleProjectsPageChange(currentProjectsPage - 1)}
                            disabled={currentProjectsPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentProjectsPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            Previous
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalProjectsPages }, (_, index) => index + 1).map((pageNumber) => (
                              <button
                                key={pageNumber}
                                onClick={() => handleProjectsPageChange(pageNumber)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentProjectsPage === pageNumber
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => handleProjectsPageChange(currentProjectsPage + 1)}
                            disabled={currentProjectsPage === totalProjectsPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentProjectsPage === totalProjectsPages
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
            </section>

            {/* Tasks Section */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-lg border border-green-100">
                    <CheckSquare size={24} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">All Tasks</h2>
                </div>
                <Link
                  to="/add-task"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  <PlusCircle size={20} />
                  Add Task
                </Link>
              </div>
              
              {tasks.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
                  <CheckSquare size={64} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Tasks Found</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first task</p>
                  <Link
                    to="/add-task"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <PlusCircle size={18} />
                    Create Task
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    {currentTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                              <Link
                                to={`/tasks/${task._id}`}
                                className="group-hover:text-green-800 transition-colors"
                              >
                                <h3 className="text-xl font-bold text-green-700 group-hover:text-green-800 transition-colors cursor-pointer">
                                  {task.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{task.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)} ml-4`}>
                              {task.status}
                            </span>
                          </div>
                          
                                                     <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                               <div className="flex items-center gap-2 text-sm text-gray-600">
                                 <Calendar size={16} className="text-green-500" />
                                 <span className="font-medium">Due:</span>
                                 <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}</span>
                               </div>
                             </div>
                            
                            <Link
                              to={`/tasks/${task._id}`}
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

                  {/* Tasks Pagination */}
                  {tasks.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mt-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, tasks.length)} of {tasks.length} tasks
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTasksPageChange(currentTasksPage - 1)}
                            disabled={currentTasksPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentTasksPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            Previous
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalTasksPages }, (_, index) => index + 1).map((pageNumber) => (
                              <button
                                key={pageNumber}
                                onClick={() => handleTasksPageChange(pageNumber)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentTasksPage === pageNumber
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => handleTasksPageChange(currentTasksPage + 1)}
                            disabled={currentTasksPage === totalTasksPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentTasksPage === totalTasksPages
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
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
