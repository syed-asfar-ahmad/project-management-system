import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AuthNavbar from "../components/AuthNavbar";
import Footer from "../components/Footer";

const API = process.env.REACT_APP_API_BASE_URL;

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Members</h1>

        {members.length === 0 ? (
          <p className="text-center text-gray-500">No members found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-white p-5 rounded-lg shadow border"
              >
                <img
                  src={
                    member.profilePicture
                      ? `${API}${member.profilePicture}`
                      : "/default_avatar.jpg"
                  }
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-indigo-700">{member.name}</h2>
                  <p className="text-gray-600 text-sm">{member.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    DOB: {member.dateOfBirth || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Gender: {member.gender || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Role: {member.role}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {member.bio || "No bio available"}
                  </p>
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

export default AllMembersPage;
