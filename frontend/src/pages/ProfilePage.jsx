import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CalendarDays, User, Image, PencilLine, Venus, Mail } from "lucide-react";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";

function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
  });
  
  const API = process.env.REACT_APP_API_BASE_URL;
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (profile.bio) formData.append("bio", profile.bio);
    if (profile.gender) formData.append("gender", profile.gender);
    if (profile.dateOfBirth) formData.append("dateOfBirth", profile.dateOfBirth);
    if (file) formData.append("profilePicture", file);

    try {
      const res = await axios.put(`${API}/users/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Updated Profile Response:", res.data);

      toast.success("Profile updated successfully");

      fetchProfile();
      setFile(null);
    } catch (err) {
      toast.error("Update failed");
    }

  };


  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <User className="w-7 h-7" /> My Profile
          </h2>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="flex items-center gap-6">
              <img
                src={
                  profile?.profilePicture
                    ? `${API}${profile.profilePicture}` 
                    : "/default_avatar.jpg"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
              
              <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline">
                <Image size={20} />
                <span>Change Picture</span>
                <input
                  type="file"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* Read-only Name */}
            <div>
              <label className="font-medium">Name</label>
              <div className="flex items-center border rounded-md px-3 bg-gray-100">
                <PencilLine size={18} className="mr-2 text-gray-400" />
                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="w-full py-2 outline-none bg-transparent text-gray-600"
                />
              </div>
            </div>

            {/* Read-only Email */}
            <div>
              <label className="font-medium">Email</label>
              <div className="flex items-center border rounded-md px-3 bg-gray-100">
                <Mail size={18} className="mr-2 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full py-2 outline-none bg-transparent text-gray-600"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="font-medium">Gender</label>
              <div className="flex items-center border rounded-md px-3">
                <Venus size={18} className="mr-2 text-gray-400" />
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full py-2 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="font-medium">Date of Birth</label>
              <div className="flex items-center border rounded-md px-3">
                <CalendarDays size={18} className="mr-2 text-gray-400" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth?.substring(0, 10)}
                  onChange={handleChange}
                  className="w-full py-2 outline-none"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="font-medium">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-md px-3 py-2 outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;
