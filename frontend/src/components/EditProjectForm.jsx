import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

function EditProjectForm({ project, token, onSuccess, onCancel }) {
  const [teamOptions, setTeamOptions] = useState([]);

  const [form, setForm] = useState({
    name: project.name || "",
    description: project.description || "",
    deadline: project.deadline?.slice(0, 10) || "",
    status: project.status || "Not Started",
    teamMembers: project.teamMembers?.map((member) => member._id) || [],
  });

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/team-members", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const options = res.data.map((member) => ({
          value: member._id,
          label: `${member.name} (${member.email})`,
        }));
        setTeamOptions(options);
      } catch (err) {
        console.error("Failed to fetch team members", err.response?.data);
      }
    };

    fetchTeamMembers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setForm((prev) => ({ ...prev, teamMembers: selectedIds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/projects/${project._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
    } catch (err) {
      console.error("Failed to update project", err.response?.data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg border w-full"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Project</h2>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Project name"
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full mb-3 p-2 border rounded"
        rows={4}
      />

      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <div className="mb-4">
        <label className="block font-medium mb-1">Team Members</label>
        <Select
          isMulti
          value={teamOptions.filter((opt) => form.teamMembers.includes(opt.value))}
          options={teamOptions}
          onChange={handleTeamChange}
          placeholder="Select team members..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditProjectForm;
