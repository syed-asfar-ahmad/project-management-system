import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_BASE_URL;

function CommentBox({ token, projectId, onCommentAdded }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post(
        `${API}/projects/${projectId}/comments`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comment posted");
      setCommentText("");
      onCommentAdded(); 
    } catch (err) {
      toast.error("Failed to post comment");
      console.error("Failed to add comment", err.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Post Comment
      </button>
    </form>
  );
}

export default CommentBox;
