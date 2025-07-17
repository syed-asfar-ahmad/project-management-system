import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllProjects } from "../services/projectService";
import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";
import BackButton from "../components/backButton";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

function Projects() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await getAllProjects(token, user?.role === "Team Member");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects");
    }
  }, [token, user?.role]);

  useEffect(() => {
    if (token && user) {
      loadProjects();
    }
  }, [token, user, loadProjects]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthNavbar />
      <BackButton />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {user?.role === "Team Member" ? "My Projects" : "All Projects"}
          </h1>

          {(user?.role === "Admin" || user?.role === "Manager") && (
            <Link
              to="/projects/create"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Create New Project
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-500">No projects available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white border rounded-lg shadow hover:shadow-md transition duration-300 p-5"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-1">
                  {project.name}
                </h2>
                <p className="text-gray-600 mb-2">{project.description}</p>

                <div className="text-sm text-gray-500 space-y-1">
                  <p><strong>Status:</strong> <span className="capitalize">{project.status}</span></p>
                  <p><strong>Deadline:</strong> {project.deadline?.slice(0, 10) || "N/A"}</p>
                  <p><strong>Team Members:</strong> {project.teamMembers?.length || 0}</p>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/projects/${project._id}`}
                    className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    → View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Projects;
