import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CommentBox from "../components/CommentBox";

function ProjectDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);

  // Fetch project details
  const fetchProject = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(res.data);
    } catch (err) {
      console.error("Failed to fetch project", err.response?.data);
    }
  }, [id, token]);

  // Fetch tasks related to this project
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks?projectId=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err.response?.data);
    }
  }, [id, token]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/projects/${id}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err.response?.data);
    }
  }, [id, token]);

  // Run all fetches on mount
  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchComments();
  }, [fetchProject, fetchTasks, fetchComments]);

  if (!project) return <p className="p-4">Loading project...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <p className="mb-2">{project.description}</p>
      <p>Status: {project.status}</p>
      <p>Deadline: {project.deadline?.slice(0, 10)}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Team Members</h2>
      <ul className="list-disc ml-6">
        {project.teamMembers?.map((member) => (
          <li key={member._id}>{member.name}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks for this project.</p>
      ) : (
        <ul className="list-disc ml-6">
          {tasks.map((task) => (
            <li key={task._id}>
              {task.title} – <span className="text-sm text-gray-500">{task.status}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="border p-4 rounded mb-4">
          {comments.map((comment) => (
            <li key={comment._id} className="mb-2 border-b pb-2">
              <strong>{comment.author?.name}:</strong> {comment.text}
            </li>
          ))}
          
        </ul>
      )}

      <CommentBox token={token} projectId={id} onCommentAdded={fetchComments} />
    </div>
  );
}

export default ProjectDetailPage;
