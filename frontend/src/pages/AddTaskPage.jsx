import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/AuthNavbar';
import Footer from '../components/Footer';
import BackButton from '../components/backButton';
import { ClipboardPlus, CalendarDays, Loader2, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

function AddTaskPage() {
  const { token } = useAuth();
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
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
          const res = await axios.get(`http://localhost:5000/api/projects/${form.project}/team-members`, {
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
      ...(name === 'project' && { assignedTo: '' }), // clear assignedTo when project changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/tasks', form, {
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
    } catch (err) {
      toast.error('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <BackButton />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white p-8 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
              <ClipboardPlus size={24} /> Create New Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  <FileText size={16} className="inline mr-1" />
                  Task Title
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
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                ></textarea>
              </div>

              {/* Project */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Project</label>
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
                <label className="block text-gray-700 font-medium mb-1">Assign To</label>
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
                <label className="block text-gray-700 font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
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
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
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
      </main>

      <Footer />
    </div>
  );
}

export default AddTaskPage;
