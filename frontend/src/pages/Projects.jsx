import { useEffect, useState } from "react";
import { getAllProjects } from "../services/projectService";
import { useAuth } from "../context/AuthContext";
import AddProjectForm from "../components/AddProjectForm";

function Projects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjects(token);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err.response?.data);
      }
    };

    fetchProjects();
  }, [token]);

  return (
    <div className="p-6">
      <AddProjectForm onProjectCreated={() => {
        const fetchProjects = async () => {
          const res = await getAllProjects(token);
          setProjects(res.data);
        };
        fetchProjects();
      }} />
      
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>
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
              <p>Project ID: {project._id}</p>
              <p>Team Members: {project.teamMembers?.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
