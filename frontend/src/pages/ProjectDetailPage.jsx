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
} from "lucide-react";
import { toast } from "react-toastify";
import InLineLoader from "../components/InLineLoader"

const API = process.env.REACT_APP_API_BASE_URL;

function ProjectDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);

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
      const url =
        user?.role === "Team Member"
          ? `${API}/tasks/project/${id}/user`
          : `${API}/tasks?projectId=${id}`;

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
    fetchProject();
    fetchTasks();
    fetchComments();
  }, [fetchProject, fetchTasks, fetchComments]);

  if (!project) return <p className="p-4"><InLineLoader message="Loading Project Details" /></p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <BackButton />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white shadow-xl rounded-xl p-6 border">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-2 w-full">
              {project.name}
            </h1>
          </div>

          <p className="text-gray-700 mb-6">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <ClipboardList className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-gray-800">{project.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="font-semibold text-gray-800">
                  {project.deadline?.slice(0, 10)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="text-purple-500" /> Team Members
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.teamMembers?.map((member) => (
                <span
                  key={member._id}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {member.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ClipboardList className="text-yellow-500" /> Tasks
            </h2>
            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks for this project.</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-3 bg-gray-100 rounded flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-600">Status: {task.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/tasks/${task._id}/edit`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Pencil size={16} /> Edit
                      </Link>
                      <button
                        onClick={() => toast.warn("🛠 Task delete functionality coming soon")}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MessageCircle className="text-indigo-500" /> Comments
            </h2>
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              <ul className="space-y-3">
                {comments.map((comment) => (
                  <li key={comment._id} className="border rounded p-3 bg-gray-50">
                    <p className="font-medium text-gray-800">{comment.author?.name}</p>
                    <p className="text-gray-700">{comment.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <CommentBox token={token} projectId={id} onCommentAdded={fetchComments} />

          {(user?.role === "Admin" || user?.role === "Manager") && (
            <div className="mt-8 flex justify-end gap-4">
              <Link
                to={`/projects/edit/${project._id}`}
                className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded hover:bg-yellow-200 flex items-center gap-2"
              >
                <Edit3 size={18} /> Edit Project
              </Link>
              <button
                onClick={handleDeleteProject}
                className="bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200 flex items-center gap-2"
              >
                <Trash2 size={18} /> Delete Project
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProjectDetailPage;
