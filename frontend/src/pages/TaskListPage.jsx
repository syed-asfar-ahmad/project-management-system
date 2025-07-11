import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);

  const { token, user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url =
          user?.role === 'Team Member'
            ? 'http://localhost:5000/api/tasks/my-tasks'
            : 'http://localhost:5000/api/tasks';

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };

    fetchTasks();
  }, [token, user]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/team-members', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeamOptions(res.data);
      } catch (err) {
        console.error('Failed to fetch users');
      }
    };
    fetchTeam();
  }, [token]);

  // Filtered Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesPriority = filterPriority ? task.priority === filterPriority : true;
    const matchesUser =
      filterUser && Array.isArray(task.assignedTo)
        ? task.assignedTo.some((u) => u?._id === filterUser)
        : true;
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesUser && matchesSearch;
  });

  if (!user) return <p className="p-4">Loading user info...</p>;


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {user?.role === 'Team Member' ? 'Tasks Assigned to You' : 'All Tasks'}
      </h2>


      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Filter by Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Filter by Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {user.role !== 'Team Member' && (
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Filter by User</option>
            {teamOptions.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>


      {/* Task Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Priority</th>
            <th className="p-2 border">Due Date</th>
            <th className="p-2 border">Assigned To</th>
            {user?.role !== 'Team Member' && <th className="p-2 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>
          ) : (
            filteredTasks.map((task) => (
              <tr key={task._id} className="text-sm">
                <td className="p-2 border">{task.title}</td>
                <td className="p-2 border">{task.status}</td>
                <td className="p-2 border">{task.priority}</td>
                <td className="p-2 border">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-2 border">
                  {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                    ? task.assignedTo
                        .map((u) => u?.name)
                        .filter(Boolean)
                        .join(', ')
                    : 'N/A'}
                </td>

                {user?.role !== 'Team Member' && (
                  <td className="p-2 border">
                    <Link
                      to={`/tasks/edit/${task._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskListPage;
