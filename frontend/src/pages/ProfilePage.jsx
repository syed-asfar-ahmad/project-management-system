import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CalendarDays,
  User,
  PencilLine,
  Mail,
  Venus,
} from "lucide-react";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import BackButton from "../components/backButton";

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
      await axios.put(`${API}/users/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully");
      fetchProfile();
      setFile(null);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleProfilePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <BackButton />

      <div className="min-h-screen bg-white p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-100 animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-blue-700">
            <User className="w-7 h-7" />
            My Profile
          </h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : profile.profilePicture
                      ? `${API}${profile.profilePicture}`
                      : "/default_avatar.jpg"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow group-hover:opacity-80 transition"
                />

                <label className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full cursor-pointer opacity-90 hover:bg-blue-700 transition">
                  <input
                    type="file"
                    hidden
                    onChange={handleProfilePictureChange}
                  />
                  Change
                </label>
              </div>
            </div>

            {/* Name (Read-only) */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Name</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-100">
                <PencilLine className="mr-2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="w-full py-2 outline-none bg-transparent text-gray-700"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-100">
                <Mail className="mr-2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full py-2 outline-none bg-transparent text-gray-700"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Gender</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white">
                <Venus className="mr-2 text-gray-400" size={18} />
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full py-2 outline-none text-gray-700"
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
              <label className="font-semibold text-gray-700 mb-1 block">Date of Birth</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white">
                <CalendarDays className="mr-2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth?.substring(0, 10)}
                  onChange={handleChange}
                  className="w-full py-2 outline-none text-gray-700"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
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
