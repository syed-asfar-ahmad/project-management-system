import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CalendarDays,
  User,
  PencilLine,
  Mail,
  Venus,
  ShieldCheck,
  UserCircle,
  Briefcase,
} from "lucide-react";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import BackButton from "../components/backButton";

const roleIcons = {
  Admin: <ShieldCheck className="inline-block w-5 h-5 text-red-500 mr-1" />,
  Manager: <Briefcase className="inline-block w-5 h-5 text-amber-500 mr-1" />,
      "Team Member": <UserCircle className="inline-block w-5 h-5 text-green-500 mr-1" />,
};

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
  const IMG = process.env.REACT_APP_API_BASE_URL.replace("/api", "");

  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    let profilePictureUrl = profile.profilePicture;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${API}/upload-profile-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.status}`);
        }

        const data = await res.json();

        if (data?.url) {
          profilePictureUrl = data.url;
        } else {
          toast.error("Image upload failed - no URL returned");
          return;
        }
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }

    try {
      await axios.put(
        `${API}/users/profile`,
        {
          bio: profile.bio,
          gender: profile.gender,
          dateOfBirth: profile.dateOfBirth,
          position: profile.position,
          profilePicture: profilePictureUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully");
      fetchProfile(); // refresh updated info
      setFile(null);  // clear selected file
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Profile update failed");
    }
  };


  const handleProfilePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please select a valid image file (JPEG, JPG, or PNG)");
      return;
    }
    
    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    
    setFile(selectedFile);
    toast.success("Image selected successfully");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <BackButton />

      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-10 items-start animate-fade-in">
          
          {/* RIGHT: Profile Form */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 w-full md:flex-[2]">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-green-700">
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
                         : profile.profilePicture || "/default_avatar.jpg"
                     }
                     alt="Profile"
                     className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow group-hover:opacity-80 transition"
                   />

                  <label className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm px-3 py-1 rounded-full cursor-pointer opacity-90 hover:bg-green-700 transition">
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
              {/* Position */}
              <div>
                <label className="font-semibold text-gray-700 mb-1 block">Position</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white">
                  <Briefcase className="mr-2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="position"
                    value={profile.position || ""}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                    className="w-full py-2 outline-none text-gray-700"
                  />
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
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Update Profile
              </button>
            </form>
          </div>

          {/* LEFT: Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center w-full md:w-96">
                         <img
               src={
                 file
                   ? URL.createObjectURL(file)
                   : profile.profilePicture || "/default_avatar.jpg"
               }
               alt="Profile"
               className="w-32 h-32 rounded-full object-cover border-4 border-green-300 mb-4 mx-auto"
             />
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {roleIcons[profile.role] || null} {profile.name}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{profile.email}</p>

            <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                Role: {profile.role || "N/A"}
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                Gender: {profile.gender || "N/A"}
              </span>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                DOB: {profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "N/A"}
              </span>
              <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                Position: {profile.position || "N/A"}
              </span>
            </div>

            <blockquote className="italic text-gray-600 mt-4">
              {profile.bio ? `"${profile.bio}"` : "No bio available."}
            </blockquote>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProfilePage;
