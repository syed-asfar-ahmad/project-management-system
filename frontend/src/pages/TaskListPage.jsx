import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import DashboardNavbar from '../components/AuthNavbar';
import { Trash2, PencilLine } from 'lucide-react';
import BackButton from '../components/backButton';

const API = process.env.REACT_APP_API_BASE_URL;

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);

  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url =
          user?.role === 'Team Member'
            ? `${API}/tasks/my-tasks`
            : `${API}/tasks`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };

    if (token && user) fetchTasks();
  }, [token, user]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${API}/users/team-members`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setTeamOptions(res.data);
        } else {
          console.log("API did not return array:", res.data);
          setTeamOptions([]); 
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
        setTeamOptions([]); 
      }
    };
    fetchTeam();
  }, [token]);


  const handleDelete = (taskId) => {
  toast.info(
    ({ closeToast }) => (
      <div>
        <p className="font-semibold text-gray-800 mb-2">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={async () => {
              closeToast();
              try {
                await axios.delete(`${API}/tasks/${taskId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Task deleted successfully!");
                navigate("/tasks"); // Or refresh task list if you're already on same page
              } catch (err) {
                toast.error("Failed to delete task");
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={closeToast}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeButton: false,
      draggable: false,
      closeOnClick: false,
    }
  );
};

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const matchesStatus = filterStatus ? task.status === filterStatus : true;
        const matchesPriority = filterPriority ? task.priority === filterPriority : true;
        const matchesUser =
          filterUser && Array.isArray(task.assignedTo)
            ? task.assignedTo.some((u) => u?._id === filterUser)
            : true;
        const matchesSearch =
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesPriority && matchesUser && matchesSearch;
      })
    : [];


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardNavbar />
      <BackButton />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {user?.role === 'Team Member' ? 'Tasks Assigned to You' : 'All Tasks'}
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          {user?.role !== 'Team Member' && (
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Filter by User</option>
              {Array.isArray(teamOptions) &&
                teamOptions.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
              ))}

            </select>
          )}
        </div>

        {/* Table for medium and larger screens */}
        <div className="hidden md:block overflow-auto rounded-lg shadow">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Priority</th>
                <th className="p-3 border">Due Date</th>
                <th className="p-3 border">Assigned To</th>
                {user?.role !== 'Team Member' && <th className="p-3 border">Actions</th>}
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
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    <td className="p-3 border font-medium text-blue-600 hover:underline">
                      {task.title}
                    </td>
                    <td className="p-3 border">{task.status}</td>
                    <td className="p-3 border">{task.priority}</td>
                    <td className="p-3 border">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-3 border">
                      {Array.isArray(task.assignedTo)
                        ? task.assignedTo.map((u) => u?.name).filter(Boolean).join(', ')
                        : 'N/A'}
                    </td>
                    {user?.role !== 'Team Member' && (
                      <td
                        className="p-3 border flex items-center gap-3 text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link to={`/tasks/${task._id}/edit`} className="hover:text-blue-800">
                          <PencilLine size={18} />
                        </Link>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card layout for small screens */}
        <div className="md:hidden flex flex-col gap-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => navigate(`/tasks/${task._id}`)}
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-blue-600">{task.title}</h3>
                <p className="text-sm text-gray-600">Status: {task.status}</p>
                <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                <p className="text-sm text-gray-600">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  Assigned: {Array.isArray(task.assignedTo)
                    ? task.assignedTo.map((u) => u?.name).filter(Boolean).join(', ')
                    : 'N/A'}
                </p>
                {user?.role !== 'Team Member' && (
                  <div
                    className="flex gap-4 mt-3 text-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to={`/tasks/${task._id}/edit`} className="hover:text-blue-800">
                      <PencilLine size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {(user?.role === "Admin" || user?.role === "Manager") && (
          <div className="flex justify-end mt-6">
            <Link
              to="/add-task"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              + Add Task
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default TaskListPage;
