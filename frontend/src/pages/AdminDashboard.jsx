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
  
  // Team management states
  const [teams, setTeams] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [createTeamForm, setCreateTeamForm] = useState({
    name: '',
    description: '',
    managerId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projRes, taskRes, memberRes, contactRes, teamsRes, usersRes] = await Promise.all([
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
          axios.get(`${API}/teams`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/teams/available-users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProjects(projRes.data);
        setTasks(taskRes.data);
        setMembers(memberRes.data);
        setContactCount(contactRes.data.length);
        setTeams(teamsRes.data);
        setAvailableUsers(usersRes.data);
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

  // Team management functions
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/teams`, createTeamForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Team created successfully!');
      setTeams([...teams, response.data.team]);
      setShowCreateTeamModal(false);
      setCreateTeamForm({ name: '', description: '', managerId: '' });
      
      // Refresh available users
      const usersRes = await axios.get(`${API}/teams/available-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableUsers(usersRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create team');
    }
  };

  const handleAddMemberToTeam = async (teamId, memberId) => {
    try {
      await axios.post(`${API}/teams/${teamId}/members`, { memberId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Member added to team successfully!');
      
      // Refresh teams and available users
      const [teamsRes, usersRes] = await Promise.all([
        axios.get(`${API}/teams`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/teams/available-users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTeams(teamsRes.data);
      setAvailableUsers(usersRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMemberFromTeam = async (teamId, memberId) => {
    try {
      await axios.delete(`${API}/teams/${teamId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Member removed from team successfully!');
      
      // Refresh teams and available users
      const [teamsRes, usersRes] = await Promise.all([
        axios.get(`${API}/teams`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/teams/available-users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTeams(teamsRes.data);
      setAvailableUsers(usersRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
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
      <main className="max-w-7xl mx-auto px-3 py-4 flex-grow">
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              {/* Spinning Circle */}
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              {/* Dashboard Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Loading Dashboard</h3>
              <p className="text-gray-600 text-sm">Fetching your project data...</p>
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
            {/* Header with Title - Styled like other pages */}
            <div className="mb-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center">
                    <BarChart size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                </div>
              </div>
              
              <div className="text-center mb-3">
                <p className="text-base text-gray-600 max-w-2xl mx-auto">
                  Monitor and manage your project ecosystem
                </p>
              </div>
            </div>

                         {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                               {/* Total Projects Card */}
                 <div className="group relative bg-gradient-to-br from-white to-green-50 p-4 rounded-xl shadow-lg border border-green-200 hover:shadow-xl hover:scale-102 transition-all duration-300 overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
                   <div className="relative z-10">
                     <div className="flex items-center justify-between mb-3">
                       <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                         <Briefcase size={20} className="text-white" />
                       </div>
                       <div className="text-right">
                         <div className="text-2xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                           {projects.length}
                         </div>
                       </div>
                     </div>
                     <div className="space-y-1">
                       <h3 className="text-base font-semibold text-gray-800">Total Projects</h3>
                       <p className="text-xs text-gray-600">Active project management</p>
                     </div>
                     <Link
                       to="/projects"
                       className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-xs shadow-lg hover:shadow-xl w-full justify-center group-hover:scale-105"
                     >
                       <Briefcase size={14} />
                       View Projects
                     </Link>
                   </div>
                 </div>

                 {/* Total Tasks Card */}
                 <div className="group relative bg-gradient-to-br from-white to-blue-50 p-4 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl hover:scale-102 transition-all duration-300 overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
                   <div className="relative z-10">
                     <div className="flex items-center justify-between mb-3">
                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                         <ClipboardList size={20} className="text-white" />
                       </div>
                       <div className="text-right">
                         <div className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                           {tasks.length}
                         </div>
                       </div>
                     </div>
                     <div className="space-y-1">
                       <h3 className="text-base font-semibold text-gray-800">Total Tasks</h3>
                       <p className="text-xs text-gray-600">Task tracking & management</p>
                     </div>
                     <Link
                       to="/tasks"
                       className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-xs shadow-lg hover:shadow-xl w-full justify-center group-hover:scale-105"
                     >
                       <ClipboardList size={14} />
                       View Tasks
                     </Link>
                   </div>
                 </div>

                 {/* Total Members Card */}
                 <div className="group relative bg-gradient-to-br from-white to-purple-50 p-4 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl hover:scale-102 transition-all duration-300 overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
                   <div className="relative z-10">
                     <div className="flex items-center justify-between mb-3">
                       <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                         <Users size={20} className="text-white" />
                       </div>
                       <div className="text-right">
                         <div className="text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                           {members.length}
                         </div>
                       </div>
                     </div>
                     <div className="space-y-1">
                       <h3 className="text-base font-semibold text-gray-800">Team Members</h3>
                       <p className="text-xs text-gray-600">Collaborative workforce</p>
                     </div>
                     <Link
                       to="/members"
                       className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium text-xs shadow-lg hover:shadow-xl w-full justify-center group-hover:scale-105"
                     >
                       <Users size={14} />
                       View Members
                     </Link>
                   </div>
                 </div>

                               {/* Contact Messages Card */}
                                 <div className="group relative bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-lg border border-orange-200 hover:shadow-xl hover:scale-102 transition-all duration-300 overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
                   <div className="relative z-10">
                     <div className="flex items-center justify-between mb-3">
                       <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                         <Mail size={20} className="text-white" />
                       </div>
                       <div className="text-right">
                         <div className="text-2xl font-bold text-gray-800 group-hover:text-orange-700 transition-colors duration-300">
                           {contactCount}
                         </div>
                       </div>
                     </div>
                     <div className="space-y-1">
                       <h3 className="text-base font-semibold text-gray-800">Contact Messages</h3>
                       <p className="text-xs text-gray-600">Customer inquiries</p>
                     </div>
                     <Link
                       to="/contact-messages"
                       className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium text-xs shadow-lg hover:shadow-xl w-full justify-center group-hover:scale-105"
                     >
                       <Mail size={14} />
                       View Messages
                     </Link>
                   </div>
                 </div>

                 {/* Total Teams Card */}
                 <div className="group relative bg-gradient-to-br from-white to-indigo-50 p-4 rounded-xl shadow-lg border border-indigo-200 hover:shadow-xl hover:scale-102 transition-all duration-300 overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
                   <div className="relative z-10">
                     <div className="flex items-center justify-between mb-3">
                       <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                         <Users size={20} className="text-white" />
                       </div>
                       <div className="text-right">
                         <div className="text-2xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                           {teams.length}
                         </div>
                       </div>
                     </div>
                     <div className="space-y-1">
                       <h3 className="text-base font-semibold text-gray-800">Total Teams</h3>
                       <p className="text-xs text-gray-600">Organized teams</p>
                     </div>
                     <button
                       onClick={() => setShowCreateTeamModal(true)}
                       className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium text-xs shadow-lg hover:shadow-xl w-full justify-center group-hover:scale-105"
                     >
                       <Users size={14} />
                       Manage Teams
                     </button>
                   </div>
                 </div>
             </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Pie Chart */}
              <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100 md:h-[300px] h-[240px] flex flex-col overflow-hidden">
                <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ClipboardList size={18} className="text-green-600" /> Task Status Overview
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
                            boxWidth: 10,
                            padding: 12,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Task counts per team member (list) */}
              <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100 h-[300px] overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={18} className="text-green-600" /> Team Members
                  </h2>
                  <Link
                    to="/members"
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    View All
                  </Link>
                </div>

                <ul className="space-y-2 text-xs text-gray-700">
                  {members.map((member) => {
                    const count = getTaskCount(member._id);
                    return (
                      <li
                        key={member._id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <span className="font-medium">{member.name}</span>
                        <Link
                          to={`/tasks?assignedTo=${member._id}`}
                          className="text-green-600 hover:text-green-800 font-medium bg-green-100 px-2 py-0.5 rounded-full text-xs hover:bg-green-200 transition-colors"
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
            <section className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1.5 rounded-full shadow-lg border border-green-100">
                    <Briefcase size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">All Projects</h2>
                </div>
                <Link
                  to="/projects/create"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                >
                  <FilePlus size={18} />
                  Add Project
                </Link>
              </div>
              
              {projects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 text-center">
                  <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Projects Found</h3>
                  <p className="text-gray-600 mb-3 text-sm">Get started by creating your first project</p>
                  <Link
                    to="/projects/create"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <FilePlus size={16} />
                    Create Project
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    {currentProjects.map((project) => (
                      <div
                        key={project._id}
                        className="bg-white rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <Link
                                to={`/projects/${project._id}`}
                                className="group-hover:text-green-800 transition-colors"
                              >
                                <h3 className="text-lg font-bold text-green-700 group-hover:text-green-800 transition-colors cursor-pointer">
                                  {project.name}
                                </h3>
                              </Link>
                              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{project.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} ml-3`}>
                              {project.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Calendar size={14} className="text-green-500" />
                                <span className="font-medium">Due:</span>
                                <span>{project.deadline?.slice(0, 10) || "N/A"}</span>
                              </div>
                            </div>
                            
                            <Link
                              to={`/projects/${project._id}`}
                              className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium text-xs shadow-md hover:shadow-lg"
                            >
                              <span>View Details</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Projects Pagination */}
                  {projects.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleProjectsPageChange(currentProjectsPage - 1)}
                            disabled={currentProjectsPage === 1}
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
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
                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
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
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
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
            <section className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1.5 rounded-full shadow-lg border border-green-100">
                    <CheckSquare size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">All Tasks</h2>
                </div>
                <Link
                  to="/add-task"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                >
                  <PlusCircle size={18} />
                  Add Task
                </Link>
              </div>
              
              {tasks.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 text-center">
                  <CheckSquare size={48} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Tasks Found</h3>
                  <p className="text-gray-600 mb-3 text-sm">Get started by creating your first task</p>
                  <Link
                    to="/add-task"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <PlusCircle size={16} />
                    Create Task
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    {currentTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <Link
                                to={`/tasks/${task._id}`}
                                className="group-hover:text-green-800 transition-colors"
                              >
                                <h3 className="text-lg font-bold text-green-700 group-hover:text-green-800 transition-colors cursor-pointer">
                                  {task.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{task.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)} ml-3`}>
                              {task.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Calendar size={14} className="text-green-500" />
                                <span className="font-medium">Due:</span>
                                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}</span>
                              </div>
                            </div>
                            
                            <Link
                              to={`/tasks/${task._id}`}
                              className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium text-xs shadow-md hover:shadow-lg"
                            >
                              <span>View Details</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tasks Pagination */}
                  {tasks.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, tasks.length)} of {tasks.length} tasks
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTasksPageChange(currentTasksPage - 1)}
                            disabled={currentTasksPage === 1}
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
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
                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
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
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
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

            {/* Team Management Section */}
            <section className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1.5 rounded-full shadow-lg border border-green-100">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Team Management</h2>
                </div>
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                >
                  <PlusCircle size={18} />
                  Create Team
                </button>
              </div>
              
              {teams.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 text-center">
                  <Users size={48} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Teams Created</h3>
                  <p className="text-gray-600 mb-3 text-sm">Create your first team to get started</p>
                  <button
                    onClick={() => setShowCreateTeamModal(true)}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <PlusCircle size={16} />
                    Create Team
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      className="bg-white rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-green-700">{team.name}</h3>
                            <p className="text-gray-600 text-xs mt-1">{team.description}</p>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {team.members?.length || 0} members
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">Manager:</span>
                            <span>{team.manager?.name || 'Not assigned'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-medium">Status:</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              team.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {team.status}
                            </span>
                          </div>
                        </div>

                        {/* Team Members List */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Team Members:</h4>
                          <div className="space-y-1">
                            {team.members?.slice(0, 3).map((member) => (
                              <div key={member._id} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">{member.name}</span>
                                <span className="text-gray-500">{member.role}</span>
                              </div>
                            ))}
                            {team.members?.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{team.members.length - 3} more members
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Add Member Dropdown */}
                        {availableUsers.length > 0 && (
                          <div className="mb-3">
                            <select
                              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAddMemberToTeam(team._id, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                            >
                              <option value="">Add member to team...</option>
                              {availableUsers.map((user) => (
                                <option key={user._id} value={user._id}>
                                  {user.name} ({user.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Create Team Modal */}
            {showCreateTeamModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Create New Team</h3>
                    <button
                      onClick={() => setShowCreateTeamModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team Name
                      </label>
                      <input
                        type="text"
                        required
                        value={createTeamForm.name}
                        onChange={(e) => setCreateTeamForm({...createTeamForm, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter team name (e.g., ABC, DEF)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        required
                        value={createTeamForm.description}
                        onChange={(e) => setCreateTeamForm({...createTeamForm, description: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="3"
                        placeholder="Enter team description"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign Manager
                      </label>
                      <select
                        required
                        value={createTeamForm.managerId}
                        onChange={(e) => setCreateTeamForm({...createTeamForm, managerId: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select a manager...</option>
                        {availableUsers.filter(user => user.role === 'Manager').map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateTeamModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Create Team
                      </button>
                    </div>
                  </form>
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

export default AdminDashboard;
