import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    assignedTo: [], // now an array
  });

  const [teamOptions, setTeamOptions] = useState([]);
  const [assignedOptions, setAssignedOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get task details
        const taskRes = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const task = taskRes.data;

        // Get team members
        const teamRes = await axios.get('http://localhost:5000/api/users/team-members', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const options = teamRes.data.map((user) => ({
          value: user._id,
          label: `${user.name} (${user.email})`,
        }));
        setTeamOptions(options);

        // Match selected members from task.assignedTo
        const selected = options.filter((opt) =>
          task.assignedTo.map((u) => u._id || u).includes(opt.value)
        );

        setAssignedOptions(selected);

        setForm({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate?.slice(0, 10) || '',
          assignedTo: task.assignedTo.map((u) => u._id || u),
        });
      } catch (err) {
        console.error('Failed to fetch data', err);
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
          assignedTo: assignedOptions.map((opt) => opt.value),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Task updated successfully!');
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to update task', err);
      alert('Failed to update task');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full mb-3 p-2 border rounded"
        ></textarea>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block mb-1 font-semibold">Assign To</label>
        <Select
          isMulti
          options={teamOptions}
          value={assignedOptions}
          onChange={(selected) => setAssignedOptions(selected)}
          className="mb-4"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Task
        </button>
      </form>
    </div>
  );
}

export default EditTaskPage;
