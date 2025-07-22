import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import {
  ClipboardList,
  Briefcase,
  CalendarDays,
  NotebookPen,
  FileText,
} from "lucide-react";

const API = process.env.REACT_APP_API_BASE_URL;

function TeamDashboard() {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await axios.get(`${API}/tasks/my-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const projectRes = await axios.get(`${API}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(taskRes.data);

        const userProjects = projectRes.data.filter(p =>
          p.teamMembers?.some(member => {
            if (typeof member === "string") {
              return member === user._id;
            } else if (typeof member === "object") {
              return member._id === user._id;
            }
            return false;
          })
        );
        setProjects(userProjects);

      } catch (err) {
        console.error("Error loading team dashboard:", err.response?.data);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AuthNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
          <NotebookPen /> Team Member Dashboard
        </h1>

        {/* Tasks Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList size={20} /> Your Assigned Tasks
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks assigned to you yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {tasks.map(task => (
                <Link
                  to={`/tasks/${task._id}`}
                  key={task._id}
                  className="bg-white p-4 rounded shadow hover:shadow-md transition border"
                >
                  <h3 className="font-bold text-indigo-700 flex items-center gap-2">
                    <FileText size={16} /> {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Briefcase size={14} /> {task.project?.name || "Unknown Project"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <ClipboardList size={14} /> {task.status}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <CalendarDays size={14} />{" "}
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Projects Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase size={20} /> Your Projects & Team
          </h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">You are not assigned to any projects yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map(project => {
                const teammates = new Set();

                tasks.forEach(task => {
                  if (task.project?._id === project._id) {
                    task.assignedTo?.forEach(member => {
                      if (typeof member === "object" && member._id !== user._id) {
                        teammates.add(member.name);
                      }
                    });
                  }
                });

                return (
                  <Link
                    to={`/projects/${project._id}`}
                    key={project._id}
                    className="bg-white p-5 rounded shadow hover:shadow-md transition border block"
                  >
                    <h3 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                      <Briefcase size={16} /> {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    {teammates.size > 0 && (
                      <p className="text-sm text-gray-500">
                        Teammates: {[...teammates].join(", ")}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default TeamDashboard;
