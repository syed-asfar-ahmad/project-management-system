import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createProject } from "../services/projectService";
import axios from "axios";
import Select from "react-select";
import { CalendarDays, Users, ClipboardList, FileText, ListChecks, UserCheck } from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_BASE_URL;


function AddProjectForm({ onProjectCreated }) {
  const { token } = useAuth();

  const [teamOptions, setTeamOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Pending",
    deadline: "",
    projectManager: "",
    teamMembers: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, managerRes] = await Promise.all([
          axios.get(`${API}/users/team-members`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/users/managers`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const teamOptions = teamRes.data.map((member) => ({
          value: member._id,
          label: `${member.name} (${member.email})`,
        }));

        const managerOptions = managerRes.data.map((manager) => ({
          value: manager._id,
          label: `${manager.name} (${manager.email})`,
        }));

        setTeamOptions(teamOptions);
        setManagerOptions(managerOptions);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setForm((prev) => ({ ...prev, teamMembers: selectedIds }));
  };

  const handleManagerChange = (selectedOption) => {
    setForm((prev) => ({ ...prev, projectManager: selectedOption ? selectedOption.value : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(form, token);
      toast.success("Project created successfully!");

      setForm({
        name: "",
        description: "",
        status: "Pending",
        deadline: "",
        projectManager: "",
        teamMembers: [],
      });

      if (onProjectCreated) onProjectCreated();
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Failed to create project");
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border border-gray-200 rounded-xl shadow-lg px-10 py-8"
    >
              <div className="flex items-center mb-6 text-green-700">
        <ClipboardList className="w-6 h-6 mr-2" />
        <h2 className="text-2xl font-bold">Project Details</h2>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700 flex items-center">
          <FileText className="w-4 h-4 mr-1" />
          Project Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter project name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700 flex items-center">
          <ListChecks className="w-4 h-4 mr-1" />
          Description
        </label>
        <textarea
          name="description"
          placeholder="Brief project description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-200"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-200"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700 flex items-center">
          <CalendarDays className="w-4 h-4 mr-1" />
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700 flex items-center">
          <UserCheck className="w-4 h-4 mr-1" />
          Project Manager
        </label>
        <Select
          options={managerOptions}
          onChange={handleManagerChange}
          placeholder="Select project manager..."
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          Assign Team Members
        </label>
        <Select
          isMulti
          options={teamOptions}
          onChange={handleTeamChange}
          placeholder="Select team members..."
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
      >
        Create Project
      </button>
    </form>
  );
}

export default AddProjectForm;
