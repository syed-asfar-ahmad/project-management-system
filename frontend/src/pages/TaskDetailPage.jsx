import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/backButton';
import axios from 'axios';
import {
  FileText,
  MessageCircle,
  Paperclip,
  UploadCloud,
  Send,
  Pencil,
  Trash2,
} from 'lucide-react';
import Navbar from '../components/AuthNavbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import InLineLoader from '../components/InLineLoader';

const API = process.env.REACT_APP_API_BASE_URL;

function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');
  const { user } = useAuth();

  const fetchTaskDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
      setComments(res.data.comments || []);
    } catch (err) {
      toast.error("Failed to load task details");
    }
  }, [id, token]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API}/tasks/${id}/comments`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments([...comments, res.data]);
      setCommentText('');
      toast.success("Comment posted");
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.warn("Please select a file to upload");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large. Max size is 10MB");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      await axios.post(`${API}/tasks/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("File uploaded successfully");
      setFile(null);
      fetchTaskDetails();
    } catch (err) {
      toast.error(`Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/tasks/${task._id}/edit`);
  };

  const handleDelete = () => {
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
                  await axios.delete(`${API}/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  toast.success("Task deleted successfully!");
                  navigate("/tasks");
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

  return (
    <>
      <Navbar />
      <BackButton />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-3xl font-bold text-gray-800 mb-6">
          <FileText size={28} />
          <h2>Task Details</h2>
        </div>

        {task ? (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4">
            <h3 className="text-2xl font-semibold text-indigo-700">{task.title}</h3>
            <p className="text-gray-700">{task.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p>Status: <span className="font-medium">{task.status}</span></p>
              <p>Priority: <span className="font-medium">{task.priority}</span></p>
              <p>Due Date: <span className="font-medium">{task.dueDate?.slice(0, 10)}</span></p>
              <p>Assigned To: <span className="font-medium">{task.assignedTo?.[0]?.name || 'N/A'}</span></p>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2 font-semibold text-lg">
                <Paperclip size={18} /> <span>Attachments</span>
              </div>
              {task.attachments?.length > 0 ? (
                <ul className="list-disc ml-5 space-y-1 text-blue-600">
                  {task.attachments.map((file, idx) => (
                    <li key={idx}>
                      <a
                        href={`${API}/${file.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {file.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No attachments</p>
              )}
            </div>
          </div>
        ) : (
          <InLineLoader message="Loading Task Details" />
        )}

        {/* Comments */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-800">
            <MessageCircle size={22} />
            <h3>Comments</h3>
          </div>

          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map((c, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-800">{c.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted by <strong>{c.author?.name || 'Unknown'}</strong> on{' '}
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
            >
              <Send size={16} /> Post
            </button>
          </form>
        </div>

        {/* File Upload */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4">
            <UploadCloud size={22} />
            <h3>Upload Attachment</h3>
          </div>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-3"
          />
          {file && <p className="text-sm text-gray-700 mb-2">Selected: {file.name}</p>}
          <button
            onClick={handleFileUpload}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded flex items-center gap-2 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={uploading}
          >
            <UploadCloud size={18} />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {/* Action Buttons */}
        {task && (user?.role === "Admin" || user?.role === "Manager") && (
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">
              <Pencil size={18} /> Edit Task
            </button>
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">
              <Trash2 size={18} /> Delete Task
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default TaskDetailPage;
