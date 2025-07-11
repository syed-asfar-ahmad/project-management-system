import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createProject } from "../services/projectService";
import axios from "axios";
import Select from "react-select";

function AddProjectForm({ onProjectCreated }) {
  const { token } = useAuth();

  const [teamOptions, setTeamOptions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Pending",
    deadline: "",
    teamMembers: [],
  });

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/team-members", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Map to format required by react-select
        const options = res.data.map((member) => ({
          value: member._id,
          label: `${member.name} (${member.email})`,
        }));

        setTeamOptions(options);
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };

    fetchTeamMembers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle react-select multi select
  const handleTeamChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setForm((prev) => ({ ...prev, teamMembers: selectedIds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(form, token);
      alert("Project created");

      setForm({
        name: "",
        description: "",
        status: "Pending",
        deadline: "",
        teamMembers: [],
      });

      if (onProjectCreated) onProjectCreated();
    } catch (err) {
      alert("Failed to create project");
      console.error(err.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
      <h2 className="text-xl font-bold mb-4">Create New Project</h2>

      <input
        type="text"
        name="name"
        placeholder="Project Name"
        value={form.name}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Project Description"
        value={form.description}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      ></textarea>

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <div className="mb-3">
        <label className="block font-semibold mb-1">Assign Team Members:</label>
        <Select
          isMulti
          options={teamOptions}
          onChange={handleTeamChange}
          placeholder="Select team members..."
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Create Project
      </button>
    </form>
  );
}

export default AddProjectForm;
