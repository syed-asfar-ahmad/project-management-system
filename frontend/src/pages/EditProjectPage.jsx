import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import EditProjectForm from "../components/EditProjectForm";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import BackButton from "../components/backButton";
import toast from "react-hot-toast";

const API = process.env.REACT_APP_API_BASE_URL;

function EditProjectPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API}/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data);
      } catch (err) {
        toast.error("Failed to load project details.");
      }
    };

    fetchProject();
  }, [id, token]);

  const handleSuccess = () => {
    toast.success("Project updated successfully!");
    navigate(`/projects/${id}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <BackButton/>
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Edit Project</h2>
        {project ? (
          <EditProjectForm
            project={project}
            token={token}
            onSuccess={handleSuccess}
            onCancel={() => navigate(`/projects/${id}`)}
          />
        ) : (
          <p>Loading...</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default EditProjectPage;
