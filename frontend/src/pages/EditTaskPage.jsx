import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import Navbar from '../components/AuthNavbar';
import Footer from '../components/Footer';
import { Pencil, XCircle } from 'lucide-react';
import BackButton from '../components/backButton';
import toast from 'react-hot-toast';

function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    assignedTo: [],
  });

  const [teamOptions, setTeamOptions] = useState([]);
  const [assignedOption, setAssignedOption] = useState(null); // single select

useEffect(() => {
  const fetchData = async () => {
    try {
      const taskRes = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const task = taskRes.data;

      // Fetch team members based on project
      const projectId = task.project?._id || task.project;
      const teamRes = await axios.get(`http://localhost:5000/api/projects/${projectId}/team-members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    }
  };

  fetchData();
}, [id]);



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {
          ...form,
          assignedTo: assignedOption ? [assignedOption.value] : [],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Task updated successfully!');
      navigate(`/tasks/${id}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };


  const handleCancel = () => {
    navigate(`/tasks/${id}`);
  };

  return (
    <>
      <Navbar />
      <BackButton/>
      <div className="max-w-4xl mx-auto p-6 min-h-screen">
        <div className="flex items-center gap-2 mb-6">
          <Pencil className="text-indigo-600" size={24} />
          <h2 className="text-3xl font-bold text-gray-800">Edit Task</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-xl space-y-6 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Assign To</label>
              <Select
                isMulti={false}
                options={teamOptions}
                value={assignedOption}
                onChange={(selected) => setAssignedOption(selected)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
              <XCircle size={18} /> Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default EditTaskPage;
