import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CommentBox from "../components/CommentBox";
import Navbar from "../components/AuthNavbar";
import BackButton from "../components/backButton";
import Footer from "../components/Footer";
import {
  CalendarDays,
  Users,
  ClipboardList,
  MessageCircle,
  Pencil,
  Trash2,
  Edit3,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_BASE_URL;

function ProjectDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(res.data);
    } catch (err) {
      toast.error("Failed to fetch project details");
    }
  }, [id, token]);

  const fetchTasks = useCallback(async () => {
    try {
      let url;
      if (user?.role === "Team Member") {
        url = `${API}/tasks/project/${id}/user`;
      } else if (user?.role === "Manager") {
        url = `${API}/tasks/manager-project/${id}`;
      } else {
        url = `${API}/tasks?projectId=${id}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  }, [id, token, user]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/projects/${id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to fetch comments");
    }
  }, [id, token]);

  const handleDeleteProject = () => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold text-gray-800 mb-2">
            Are you sure you want to delete this project?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                closeToast();
                try {
                  await axios.delete(`${API}/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  toast.success("Project deleted successfully!");
                  navigate("/projects");
                } catch (err) {
                  toast.error("Failed to delete project");
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProject(), fetchTasks(), fetchComments()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchProject, fetchTasks, fetchComments]);

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

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'To Do':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
        <Navbar />
        <BackButton />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          {/* Loading State */}
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Project Details</h3>
              <p className="text-gray-600">Fetching project information...</p>
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

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
        <Navbar />
        <BackButton />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
            <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Project Not Found</h3>
            <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Link to="/projects" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              <ArrowRight size={18} />
              Back to Projects
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />
      <BackButton />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
                  <p className="text-gray-600">Project Details</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info Cards */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarDays className="text-green-500" />
                Project Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CalendarDays className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-semibold text-gray-800">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Team Size</p>
                    <p className="font-semibold text-gray-800">
                      {project.teamMembers?.length || 0} members
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ClipboardList className="text-yellow-500" />
                Project Tasks ({tasks.length})
              </h2>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks for this project yet.</p>
                </div>
              ) : (
                                 <div className="space-y-3">
                   {tasks.map((task) => (
                     <div
                       key={task._id}
                       className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                       onClick={() => navigate(`/tasks/${task._id}`)}
                     >
                       <div className="flex items-center justify-between">
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                             {getTaskStatusIcon(task.status)}
                             <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">{task.title}</h3>
                           </div>
                           <div className="flex items-center gap-4 text-sm text-gray-600">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                               {task.status}
                             </span>
                             <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</span>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                           {(user?.role === "Admin" || (user?.role === "Manager" && project.teamMembers?.some(member => 
                             typeof member === "string" ? member === user._id : member._id === user._id
                           ))) && (
                             <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                               <Link
                                 to={`/tasks/${task._id}/edit`}
                                 className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                               >
                                 <Pencil size={16} />
                               </Link>
                               <button
                                 onClick={() => toast.warn("🛠 Task delete functionality coming soon")}
                                 className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MessageCircle className="text-indigo-500" />
                Comments ({comments.length})
              </h2>
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {comments.map((comment) => (
                    <div key={comment._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{comment.author?.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-10">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
              <CommentBox token={token} projectId={id} onCommentAdded={fetchComments} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="text-purple-500" />
                Team Members
              </h2>
              {project.teamMembers?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No team members assigned</p>
              ) : (
                <div className="space-y-3">
                  {project.teamMembers?.map((member) => (
                    <div key={member._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {member.name?.charAt(0)?.toUpperCase() || 'M'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Actions */}
            {(user?.role === "Admin" || (user?.role === "Manager" && project.teamMembers?.some(member => 
              typeof member === "string" ? member === user._id : member._id === user._id
            ))) && (
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Actions</h2>
                <div className="space-y-3">
                  <Link
                    to={`/projects/edit/${project._id}`}
                    className="flex items-center gap-3 w-full p-3 bg-yellow-50 text-yellow-800 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <Edit3 size={18} />
                    <span className="font-medium">Edit Project</span>
                  </Link>
                  <button
                    onClick={handleDeleteProject}
                    className="flex items-center gap-3 w-full p-3 bg-red-50 text-red-800 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                    <span className="font-medium">Delete Project</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProjectDetailPage;
