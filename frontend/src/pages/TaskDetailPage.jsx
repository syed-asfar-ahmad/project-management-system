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
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  User,
  ArrowRight,
  Download,
  Eye,
  File,
  Image,
  FileText as FileTextIcon,
} from 'lucide-react';
import Navbar from '../components/AuthNavbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_BASE_URL;

function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const fetchTaskDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
      setComments(res.data.comments || []);
    } catch (err) {
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckSquare className="w-5 h-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'To Do':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return <Image className="w-5 h-5 text-blue-500" />;
      case 'pdf':
        return <FileTextIcon className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileTextIcon className="w-5 h-5 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FileTextIcon className="w-5 h-5 text-green-600" />;
      case 'txt':
        return <FileTextIcon className="w-5 h-5 text-gray-600" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const isPreviewable = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const previewableExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'pdf', 'txt'];
    return previewableExtensions.includes(extension);
  };

  const handleDownload = async (attachmentId) => {
    console.log('Downloading attachment:', attachmentId);
    console.log('Task attachments:', task.attachments);
    
    try {
      const response = await axios.get(`${API}/tasks/${id}/attachments/${attachmentId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', task.attachments.find(a => a._id === attachmentId)?.filename || 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("File downloaded successfully!");
    } catch (err) {
      console.error('Download error:', err);
      toast.error("Failed to download file");
    }
  };

  const handlePreview = (attachment) => {
    if (attachment.path.startsWith('http')) {
      window.open(attachment.path, '_blank');
    } else {
      // For local files, use the preview endpoint
      window.open(`${API}/tasks/${id}/attachments/${attachment._id}/preview`, '_blank');
    }
  };

  const handleDeleteAttachment = (attachmentId) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold text-gray-800 mb-2">
            Are you sure you want to delete this attachment?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                closeToast();
                try {
                  await axios.delete(`${API}/tasks/${id}/attachments/${attachmentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  toast.success("Attachment deleted successfully!");
                  fetchTaskDetails();
                } catch (err) {
                  toast.error("Failed to delete attachment");
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
              {/* Task Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckSquare size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Task Details</h3>
              <p className="text-gray-600">Fetching task information...</p>
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

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
        <Navbar />
        <BackButton />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
            <CheckSquare size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Task Not Found</h3>
            <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have access to it.</p>
            <button 
              onClick={() => navigate("/tasks")} 
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <ArrowRight size={18} />
              Back to Tasks
            </button>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <CheckSquare size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words leading-tight">{task.title}</h1>
                  <p className="text-gray-600 mt-1">Task Details</p>
                </div>
              </div>
                             <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} w-fit`}>
                   {task.status}
                 </span>
                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)} w-fit`}>
                   {task.priority}
                 </span>
               </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{task.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Information */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-green-500" />
                Task Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getTaskStatusIcon(task.status)}
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-800">{task.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <AlertCircle className="text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <p className="font-semibold text-gray-800">{task.priority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-semibold text-gray-800">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <p className="font-semibold text-gray-800">
                      {task.assignedTo?.[0]?.name || 'Unassigned'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Paperclip className="text-indigo-500" />
                Attachments ({task.attachments?.length || 0})
              </h2>
              {task.attachments?.length > 0 ? (
                <div className="space-y-3">
                  {task.attachments.map((file, idx) => (
                    <div key={file._id || idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(file.filename)}
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-800 block truncate">{file.filename}</span>
                          <span className="text-xs text-gray-500">
                            {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Unknown date'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Preview Button */}
                        {isPreviewable(file.filename) && (
                          <button
                            onClick={() => handlePreview(file)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Preview file"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        
                        {/* Download Button */}
                        <button
                          onClick={() => handleDownload(file._id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                          title="Download file"
                        >
                          <Download size={16} />
                        </button>
                        
                        {/* Delete Button - Admin Only */}
                        {user?.role === 'Admin' && (
                          <button
                            onClick={() => handleDeleteAttachment(file._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete attachment"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Paperclip size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No attachments uploaded yet.</p>
                </div>
              )}
            </div>

            {/* Comments */}
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
                  {comments.map((c, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {c.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{c.author?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-10">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Send size={16} /> Post
                </button>
              </form>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UploadCloud className="text-blue-500" />
                Upload Attachment
              </h2>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {file && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">Selected: {file.name}</p>
                  </div>
                )}
                <button
                  onClick={handleFileUpload}
                  className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                    uploading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={uploading}
                >
                  <UploadCloud size={18} />
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Actions */}
            {(user?.role === "Admin" || user?.role === "Manager") && (
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-3 w-full p-3 bg-yellow-50 text-yellow-800 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <Pencil size={18} />
                    <span className="font-medium">Edit Task</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-3 w-full p-3 bg-red-50 text-red-800 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                    <span className="font-medium">Delete Task</span>
                  </button>
                </div>
              </div>
            )}

            {/* Project Info */}
            {task.project && (
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Project</h2>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">{task.project.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{task.project.description}</p>
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

export default TaskDetailPage;
