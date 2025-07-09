import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Tasks</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Priority</th>
            <th className="p-2 border">Due Date</th>
            <th className="p-2 border">Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id} className="text-center">
              <td className="p-2 border">{task.title}</td>
              <td className="p-2 border">{task.status}</td>
              <td className="p-2 border">{task.priority}</td>
              <td className="p-2 border">{new Date(task.dueDate).toLocaleDateString()}</td>
              <td>
                    {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                        ? task.assignedTo.map((user) => user?.name).join(', '): 'N/A'}
              </td>
              <td className="p-2 border">
                <Link
                    to={`/tasks/edit/${task._id}`}
                    className="text-blue-500 hover:underline"
                >
                    Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskListPage;
