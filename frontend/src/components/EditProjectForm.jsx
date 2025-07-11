import { useState } from "react";
import axios from "axios";

function EditProjectForm({ project, token, onSuccess }) {
  const [form, setForm] = useState({
    name: project.name || "",
    description: project.description || "",
    deadline: project.deadline?.slice(0, 10) || "",
    status: project.status || "Not Started",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/projects/${project._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess(); // refresh details
    } catch (err) {
      console.error("Failed to update project", err.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <h2 className="text-lg font-semibold mb-2">Edit Project</h2>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Project name"
        className="w-full p-2 mb-2 border rounded"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 mb-2 border rounded"
      />

      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
}

export default EditProjectForm;
