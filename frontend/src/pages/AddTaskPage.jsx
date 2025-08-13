import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/AuthNavbar';
import Footer from '../components/Footer';
import BackButton from '../components/backButton';
import { ClipboardPlus, CalendarDays, Loader2, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API = process.env.REACT_APP_API_BASE_URL;

function AddTaskPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    project: '',
    assignedTo: '',
  });
  const [selectedProjectDeadline, setSelectedProjectDeadline] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter out completed projects
        const activeProjects = res.data.filter(project => project.status !== 'Completed');
        setProjects(activeProjects);
      } catch (err) {
        toast.error('Error loading projects');
      }
    };

    fetchProjects();
  }, [token]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (form.project) {
        try {
          const res = await axios.get(`${API}/projects/${form.project}/team-members`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProjectMembers(res.data);
        } catch (err) {
          toast.error('Error fetching team members');
          setProjectMembers([]);
        }
      } else {
        setProjectMembers([]);
      }
    };

    fetchTeamMembers();
  }, [form.project, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'project' && { assignedTo: '' }), 
    }));

    // If project is selected, get its deadline
    if (name === 'project') {
      const selectedProject = projects.find(p => p._id === value);
      if (selectedProject) {
        // Ensure the deadline is in YYYY-MM-DD format for HTML date input
        const deadlineDate = new Date(selectedProject.deadline);
        const formattedDeadline = deadlineDate.toISOString().split('T')[0];
        setSelectedProjectDeadline(formattedDeadline);
        // Reset due date when project changes
        setForm(prev => ({ ...prev, dueDate: '' }));
      } else {
        setSelectedProjectDeadline('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/tasks`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task created successfully!');
      setForm({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '',
        project: '',
        assignedTo: '',
      });
      setProjectMembers([]);
      setSelectedProjectDeadline(''); // Reset project deadline state
    } catch (err) {
      toast.error('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="w-full max-w-[1000px] mx-auto">
                  {/* Header with Back Button and Title - Responsive */}
        <div className="w-full max-w-[1000px] mx-auto mb-4">
          {/* Back Button - Top Row on Mobile */}
          <div className="mb-3 md:hidden">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 font-medium text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
          
          {/* Desktop Layout - Back Button and Title on Same Line */}
          <div className="hidden md:flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 font-medium text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center">
                <ClipboardPlus size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                Create New Task
              </h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer to center the title */}
          </div>
          
          {/* Mobile Layout - Centered Title */}
          <div className="md:hidden text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center">
                <ClipboardPlus size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                Create New Task
              </h1>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-3">
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Add a new task to your project
          </p>
        </div>
          
          <div className="bg-white p-8 shadow-md rounded-xl w-full min-h-[600px]">

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
                             <div>
                 <label className="block text-gray-700 font-medium mb-1">
                   <FileText size={16} className="inline mr-1" />
                   Task Title <span className="text-red-500 ml-1">*</span>
                 </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Description */}
                             <div>
                 <label className="block text-gray-700 font-medium mb-1">Description <span className="text-red-500 ml-1">*</span></label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                ></textarea>
              </div>

              {/* Project */}
                             <div>
                 <label className="block text-gray-700 font-medium mb-1">Project <span className="text-red-500 ml-1">*</span></label>
                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select a Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Assign To <span className="text-red-500 ml-1">*</span></label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select a Team Member</option>
                  {projectMembers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
                             <div>
                 <label className="block text-gray-700 font-medium mb-1">Status <span className="text-red-500 ml-1">*</span></label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Priority */}
                             <div>
                 <label className="block text-gray-700 font-medium mb-1">Priority <span className="text-red-500 ml-1">*</span></label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Due Date */}
                             <div>
                 <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
                   <CalendarDays size={16} />
                   Due Date <span className="text-red-500 ml-1">*</span>
                 </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} // Cannot be in the past
                  max={selectedProjectDeadline} // Cannot exceed project deadline
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={!selectedProjectDeadline} // Disable if no project selected
                />
                {selectedProjectDeadline && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">📅 Project Deadline:</span> {new Date(selectedProjectDeadline).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Task due date must be between today and project deadline
                    </p>
                  </div>
                )}
                {!selectedProjectDeadline && (
                  <p className="text-sm text-gray-500 mt-1">
                    Please select a project first to set task deadline
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 flex items-center justify-center gap-2 ${
                    loading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  Create Task
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddTaskPage;
