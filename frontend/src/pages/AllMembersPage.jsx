import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import { ShieldCheck, UserCircle, Briefcase } from "lucide-react";

const API = process.env.REACT_APP_API_BASE_URL;

const roleIcons = {
  Admin: <ShieldCheck className="inline-block w-5 h-5 text-red-500 mr-1" />,
  Manager: <Briefcase className="inline-block w-5 h-5 text-amber-500 mr-1" />,
      "Team Member": <UserCircle className="inline-block w-5 h-5 text-green-500 mr-1" />,
};

function AllMembersPage() {
  const { token, user } = useAuth();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };

    if (user?.role === "Admin") {
      fetchMembers();
    }
  }, [token, user]);

  return (
          <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <AuthNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Team Members</h1>

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
