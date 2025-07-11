import { useEffect, useState, useCallback } from "react"; // FIXED: Removed Link from here
import { Link } from "react-router-dom"; // Should be imported separately from react-router-dom
import { getAllProjects } from "../services/projectService";
import { useAuth } from "../context/AuthContext";
import AddProjectForm from "../components/AddProjectForm";

function Projects() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await getAllProjects(token, user?.role === "Team Member");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err.response?.data);
    }
  }, [token, user?.role]);

  useEffect(() => {
    if (token && user) {
      loadProjects();
    }
  }, [token, user, loadProjects]);

  return (
    <div className="p-6">
      {(user?.role === "Admin" || user?.role === "Manager") && (
        <AddProjectForm onProjectCreated={loadProjects} />
      )}

      <h1 className="text-2xl font-bold mb-4">
        {user?.role === "Team Member" ? "My Projects" : "All Projects"}
      </h1>

      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project._id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p>{project.description}</p>
              <p className="text-sm text-gray-500">Status: {project.status}</p>
              <p>Deadline: {project.deadline?.slice(0, 10)}</p>
              <p>Team Members: {project.teamMembers?.length}</p>
              <Link
                to={`/projects/${project._id}`}
                className="text-blue-500 hover:underline mr-2"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
