import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import EditProjectForm from "../components/EditProjectForm";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import BackButton from "../components/backButton";
import { toast } from "react-toastify";
import { Briefcase, ArrowLeft } from "lucide-react";

const API = process.env.REACT_APP_API_BASE_URL;

function EditProjectPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data);
      } catch (err) {
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  const handleSuccess = () => {
    toast.success("Project updated successfully!");
    navigate(`/projects/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
        <Navbar />
        <BackButton />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          {/* Loading State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              {/* Spinning Circle */}
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              {/* Project Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Project Details</h3>
              <p className="text-gray-600">Fetching project information...</p>
            </div>
            {/* Loading Dots */}
            <div className="flex space-x-2 mt-4">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
        <Navbar />
        <BackButton />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
            <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Project Not Found</h3>
            <p className="text-gray-600 mb-4">The project you're trying to edit doesn't exist or you don't have access to it.</p>
            <button 
              onClick={() => navigate("/projects")} 
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              Back to Projects
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />
      <BackButton />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Edit Project</h1>
                <p className="text-gray-600">Update project information and settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <EditProjectForm
              project={project}
              token={token}
              onSuccess={handleSuccess}
              onCancel={() => navigate(`/projects/${id}`)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EditProjectPage;
