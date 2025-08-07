import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { 
  Briefcase, 
  Calendar, 
  Users, 
  FileText, 
  Save, 
  XCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck
} from "lucide-react";

const API = process.env.REACT_APP_API_BASE_URL;

function EditProjectForm({ project, token, onSuccess, onCancel }) {
  const [teamOptions, setTeamOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: project.name || "",
    description: project.description || "",
    deadline: project.deadline?.slice(0, 10) || "",
         status: project.status || "Pending",
    projectManager: project.projectManager || "",
    teamMembers: project.teamMembers?.map((member) => member._id) || [],
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
        console.error("Failed to fetch data", err.response?.data);
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
    setSubmitting(true);
    try {
      await axios.put(`${API}/projects/${project._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
    } catch (err) {
      console.error("Failed to update project", err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
             case 'Pending':
         return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Project Name <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter project name"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter project description"
            rows="4"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
            required
          />
        </div>
      </div>

      {/* Deadline, Status, and Project Manager */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deadline <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getStatusIcon(form.status)}
            </div>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white appearance-none"
              required
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
                             <option value="Pending">Pending</option>
               <option value="In Progress">In Progress</option>
               <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Manager
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCheck className="h-5 w-5 text-gray-400" />
            </div>
            <div className="pl-10">
              <Select
                value={managerOptions.find((opt) => opt.value === form.projectManager)}
                options={managerOptions}
                onChange={handleManagerChange}
                placeholder="Select project manager..."
                isClearable
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    minHeight: '48px',
                    border: state.isFocused ? '2px solid #10b981' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxShadow: state.isFocused ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : 'none',
                    '&:hover': {
                      border: '1px solid #10b981'
                    }
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f0fdf4' : 'white',
                    color: state.isSelected ? 'white' : '#374151',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#10b981' : '#f0fdf4'
                    }
                  }),
                  menu: (provided) => ({
                    ...provided,
                    maxHeight: '200px'
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members - Separate Row */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Team Members
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="pl-10">
            <Select
              isMulti
              value={teamOptions.filter((opt) =>
                form.teamMembers.includes(opt.value)
              )}
              options={teamOptions}
              onChange={handleTeamChange}
              placeholder="Select team members..."
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: '48px',
                  maxHeight: '120px',
                  width: '100%',
                  border: state.isFocused ? '2px solid #10b981' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  boxShadow: state.isFocused ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : 'none',
                  '&:hover': {
                    border: '1px solid #10b981'
                  }
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  maxHeight: '80px',
                  overflow: 'auto',
                  flexWrap: 'wrap'
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f0fdf4' : 'white',
                  color: state.isSelected ? 'white' : '#374151',
                  '&:hover': {
                    backgroundColor: state.isSelected ? '#10b981' : '#f0fdf4'
                  }
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  flexShrink: 0,
                  minWidth: 'fit-content'
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: '#166534',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '150px'
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: '#166534',
                  '&:hover': {
                    backgroundColor: '#dcfce7',
                    color: '#166534'
                  }
                }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: '200px'
                })
              }}
            />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Select team members
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors w-full sm:w-auto"
        >
          <XCircle size={18} /> Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className={`flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors w-full sm:w-auto ${
            submitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <Save size={18} />
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

export default EditProjectForm;
