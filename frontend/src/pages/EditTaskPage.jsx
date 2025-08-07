import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/AuthNavbar';
import Footer from '../components/Footer';
import { Pencil, XCircle, CheckSquare, ArrowLeft, Save } from 'lucide-react';
import BackButton from '../components/backButton';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_BASE_URL;

function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    assignedTo: [],
  });

  const [teamOptions, setTeamOptions] = useState([]);
  const [assignedOption, setAssignedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const taskRes = await axios.get(`${API}/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const task = taskRes.data;
        const projectId = task.project?._id || task.project;

        const teamRes = await axios.get(`${API}/projects/${projectId}/team-members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const options = teamRes.data.map((user) => ({
          value: user._id,
          label: `${user.name} (${user.email})`,
        }));

        setTeamOptions(options);

        const selected = options.find(
          (opt) => (task.assignedTo[0]?._id || task.assignedTo[0]) === opt.value
        );

        setAssignedOption(selected || null);

        setForm({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate?.slice(0, 10) || '',
          assignedTo: task.assignedTo.map((u) => u._id || u),
        });
      } catch (err) {
        toast.error('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(
        `${API}/tasks/${id}`,
        {
          ...form,
          assignedTo: assignedOption ? [assignedOption.value] : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Task updated successfully!');
      navigate(`/tasks/${id}`);
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/tasks/${id}`);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />
      <BackButton />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pencil size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Edit Task</h1>
                <p className="text-gray-600">Update task information and settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Task Title <span className="text-red-500 ml-1">*</span>
                 </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter task title"
                  required
                />
              </div>

                             <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Due Date <span className="text-red-500 ml-1">*</span>
                 </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Description */}
                         <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Description <span className="text-red-500 ml-1">*</span>
               </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                placeholder="Enter task description"
              ></textarea>
            </div>

            {/* Status, Priority, and Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Status <span className="text-red-500 ml-1">*</span>
                 </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

                             <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Priority <span className="text-red-500 ml-1">*</span>
                 </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign To
                </label>
                <Select
                  isMulti={false}
                  options={teamOptions}
                  value={assignedOption}
                  onChange={(selected) => setAssignedOption(selected)}
                  className="mt-1"
                  placeholder="Select team member"
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
                    })
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <XCircle size={18} /> Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Save size={18} />
                {submitting ? 'Updating...' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EditTaskPage;
