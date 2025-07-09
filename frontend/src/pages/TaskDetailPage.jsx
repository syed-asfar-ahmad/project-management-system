import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch task and comments
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error('Failed to load task details:', err);
      }
    };

    fetchTaskDetails();
  }, [id, token]);

  // Submit new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/tasks/${id}/comments`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments([
        ...comments,
        {
          text: commentText,
          createdAt: new Date().toISOString(),
        },
      ]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Error posting comment');
    }
  };

  // Upload file
  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      await axios.post(`http://localhost:5000/api/tasks/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('File uploaded!');
      setFile(null);
      // Refetch task to get updated attachments
      const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Task Details</h2>

      {task ? (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
          <p className="mb-2">{task.description}</p>
          <p>Status: <strong>{task.status}</strong></p>
          <p>Priority: <strong>{task.priority}</strong></p>
          <p>Due Date: <strong>{task.dueDate?.slice(0, 10)}</strong></p>

          {/* Attachments */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Attachments:</h4>
            {task.attachments?.length > 0 ? (
              <ul className="list-disc ml-5">
                {task.attachments.map((file, idx) => (
                  <li key={idx}>
                    <a
                      href={`http://localhost:5000/${file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
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
        <p>Loading task...</p>
      )}

      {/* Comments */}
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      <div className="space-y-3 mb-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded">
              <p className="text-sm">{c.text}</p>
              <p className="text-xs text-gray-500">Posted on {new Date(c.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded">
          Post
        </button>
      </form>

      {/* Upload Form */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Upload Attachment</h3>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
        <button
          onClick={handleFileUpload}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}

export default TaskDetailPage;
