import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import { ShieldCheck, UserCircle, Briefcase, Users } from "lucide-react";

const API = process.env.REACT_APP_API_BASE_URL;

const roleIcons = {
  Admin: <ShieldCheck className="inline-block w-5 h-5 text-red-500 mr-1" />,
  Manager: <Briefcase className="inline-block w-5 h-5 text-amber-500 mr-1" />,
      "Team Member": <UserCircle className="inline-block w-5 h-5 text-green-500 mr-1" />,
};

function AllMembersPage() {
  const { token, user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "Admin") {
      fetchMembers();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
        <AuthNavbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          {/* Loading State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              {/* Spinning Circle */}
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              {/* Users Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Team Members</h3>
              <p className="text-gray-600">Fetching member information...</p>
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <AuthNavbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Team Members</h1>
          <p className="text-gray-600">View all team members and their details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition duration-300 border border-gray-200"
            >
              <div className="flex flex-col items-center text-center">
              <img
                src={
                  member.profilePicture
                    ? member.profilePicture // No need to prefix with base URL now
                    : "/default_avatar.jpg"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-300 mb-4"
              />
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {roleIcons[member.role]} {member.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">{member.email}</p>

                <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Role: {member.role}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Gender: {member.gender || "N/A"}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                    DOB: {member.dateOfBirth ? member.dateOfBirth.slice(0, 10) : "N/A"}
                  </span>
                  <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Position: {member.position || "N/A"}
                  </span>
                </div>

                <blockquote className="italic text-gray-600 mt-4">
                  {member.bio ? `"${member.bio}"` : "No bio available."}
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AllMembersPage;
