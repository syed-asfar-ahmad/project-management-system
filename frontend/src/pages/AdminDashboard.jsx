import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import { toast } from 'react-hot-toast'; 
import {
  BarChart,
  FilePlus,
  ListTodo,
  Users,
  PlusCircle,
  ClipboardList,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const API = process.env.REACT_APP_API_BASE_URL;

function AdminDashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [projRes, taskRes, memberRes] = await Promise.all([
        axios.get(`${API}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/users/team-members`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProjects(projRes.data);
      setTasks(taskRes.data);
      setMembers(memberRes.data);
    } catch (err) {
      toast.error("Failed to fetch dashboard data");
    }
  };

  fetchData();
}, [token]);



  // Task Status Counts
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { "To Do": 0, "In Progress": 0, Completed: 0 }
  );

  const taskStatusData = {
    labels: ["To Do", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks by Status",
        data: [
          statusCounts["To Do"],
          statusCounts["In Progress"],
          statusCounts["Completed"],
        ],
        backgroundColor: ["#facc15", "#38bdf8", "#4ade80"],
        borderWidth: 1,
      },
    ],
  };

  // Correct task count logic for assignedTo (which is an array)
  const getTaskCount = (memberId) => {
    return tasks.filter((task) => {
      const assignedList = task.assignedTo;
      if (!Array.isArray(assignedList)) return false;

      return assignedList.some(
        (assigned) => assigned === memberId || assigned._id === memberId
      );
    }).length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
          <BarChart /> Admin & Manager Dashboard
        </h1>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded shadow md:h-[360px] h-[280px] flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <ClipboardList size={20} /> Task Status Overview
            </h2>
            <div className="flex-grow relative">
              <Pie
                data={taskStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        boxWidth: 12,
                        padding: 15,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>


          {/* Task counts per team member (list) */}
          <div className="bg-white p-6 rounded shadow h-[360px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Users size={20} /> Team Members & Their Tasks
              </h2>
              <Link
                to="/members"
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition duration-200"
              >
                View All
              </Link>
            </div>

  <ul className="space-y-2 text-sm text-gray-700">
    {members.map((member) => {
      const count = getTaskCount(member._id);
      return (
        <li
          key={member._id}
          className="flex justify-between items-center border-b pb-1"
        >
          <span className="font-medium">{member.name}</span>
          <Link
            to={`/tasks?assignedTo=${member._id}`}
            className="text-blue-600 hover:underline"
          >
            {count} task{count !== 1 ? "s" : ""}
          </Link>
        </li>
      );
    })}
  </ul>
</div>

        </div>

        {/* Projects Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <ListTodo /> All Projects
            </h2>
            <Link
              to="/projects/create"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <FilePlus size={18} /> Add Project
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((p) => (
                <Link
                  to={`/projects/${p._id}`}
                  key={p._id}
                  className="block bg-white p-4 rounded shadow hover:shadow-md transition border"
                >
                  <h3 className="font-bold text-indigo-700 text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Tasks Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <ListTodo /> All Tasks
            </h2>
            <Link
              to="/add-task"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle size={18} /> Add Task
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((t) => (
                <Link
                  to={`/tasks/${t._id}`}
                  key={t._id}
                  className="block bg-white p-4 rounded shadow hover:shadow-md transition border"
                >
                  <h3 className="font-bold text-indigo-700">{t.title}</h3>
                  <p className="text-sm text-gray-600">Status: {t.status}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
