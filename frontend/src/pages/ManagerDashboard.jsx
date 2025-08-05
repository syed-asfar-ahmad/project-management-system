import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import { toast } from 'react-hot-toast'; 

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

const API = process.env.REACT_APP_API_BASE_URL;

function ManagerDashboard() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProjectsPage, setCurrentProjectsPage] = useState(1);
  const [currentTasksPage, setCurrentTasksPage] = useState(1);
  const [projectsPerPage] = useState(4);
  const [tasksPerPage] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projRes, taskRes, memberRes] = await Promise.all([
          axios.get(`${API}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/tasks/manager-tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/users/team-members`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        // Filter projects to show those where manager is assigned as team member OR project manager
        const assignedProjects = projRes.data.filter(project => 
          project.teamMembers?.some(member => 
            typeof member === "string" ? member === user._id : member._id === user._id
          ) || 
          (project.projectManager && 
           (typeof project.projectManager === "string" ? 
            project.projectManager === user._id : 
            project.projectManager._id === user._id))
        );
        
        setProjects(assignedProjects);
        setTasks(taskRes.data);
        setMembers(memberRes.data);
      } catch (err) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user._id]);

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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'on hold':
        return 'bg-red-100 text-red-800';
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

  const getTaskCount = (memberId) => {
    return tasks.filter(task => task.assignedTo === memberId).length;
  };

  // Chart data
  const taskStatusData = {
    labels: ['Completed', 'In Progress', 'To Do'],
    datasets: [
      {
        data: [
          tasks.filter(task => task.status === 'Completed').length,
          tasks.filter(task => task.status === 'In Progress').length,
          tasks.filter(task => task.status === 'To Do').length,
        ],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <AuthNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Manager Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <AuthNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Manage assigned projects and tasks.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
                <p className="text-sm font-medium text-gray-600">Team Members</p>
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
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-800">
                  {tasks.filter(task => task.status === 'Completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckSquare size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
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
            <div className="text-sm text-gray-600">Only assigned projects are shown</div>
          </div>
          
          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
              <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
              <p className="text-gray-600 mb-4">No projects have been assigned to you yet</p>
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
                <ClipboardList size={24} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Tasks</h2>
            </div>
            <Link to="/add-task" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
              <PlusCircle size={20} /> Add Task
            </Link>
          </div>
          
          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
              <ClipboardList size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Tasks Found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first task</p>
              <Link to="/add-task" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                <PlusCircle size={18} /> Create Task
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
                            <h3 className="text-lg font-bold text-green-700 group-hover:text-green-800 transition-colors cursor-pointer">
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
                            <span>{task.dueDate?.slice(0, 10) || "N/A"}</span>
                          </div>
                          {task.assignedTo && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users size={16} className="text-green-500" />
                              <span className="font-medium">Assigned:</span>
                              <span>{task.assignedTo?.name || "Unassigned"}</span>
                            </div>
                          )}
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
      </main>

      <Footer />
    </div>
  );
}

export default ManagerDashboard; 