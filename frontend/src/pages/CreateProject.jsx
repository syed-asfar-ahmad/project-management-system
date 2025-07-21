import { FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import AddProjectForm from "../components/AddProjectForm";
import BackButton from '../components/backButton';
import { toast } from 'react-hot-toast'; 

function CreateProject() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success("Project created successfully!"); 
    navigate("/projects");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100">
      <AuthNavbar />
      <BackButton />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center mb-6 text-blue-700">
          <FolderPlus className="w-8 h-8 mr-2" />
          <h2 className="text-3xl font-semibold">Create New Project</h2>
        </div>

        <p className="text-gray-600 text-center mb-6">
          Provide essential details below to add a new project to your workspace.
        </p>

        {/* Clean form, already styled inside */}
        <AddProjectForm onProjectCreated={handleSuccess} />
      </main>

      <Footer />
    </div>
  );
}

export default CreateProject;
