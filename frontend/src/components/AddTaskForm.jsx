import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AddTaskForm({ onTaskCreated }) {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    project: '',
    assignedTo: ''
  });

  // Fetch all projects
  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/projects', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/users/team-members', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProjects(projectsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchProjectsAndUsers();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Task Created');
      setForm({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '',
        project: '',
        assignedTo: ''
      });
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      alert('Error creating task');
      console.error(err.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>

      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={form.title}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Task Description"
        value={form.description}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      ></textarea>

      <select
        name="project"
        value={form.project}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      >
        <option value="">Select Project</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        name="assignedTo"
        value={form.assignedTo}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      >
        <option value="">Assign To</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Task
      </button>
    </form>
  );
}

export default AddTaskForm;
