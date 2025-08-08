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
  MapPin,
  Quote,
  Camera,
  Save,
} from "lucide-react";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import BackButton from "../components/backButton";

const roleIcons = {
  Admin: <ShieldCheck className="inline-block w-4 h-4 text-red-500 mr-1" />,
  Manager: <Briefcase className="inline-block w-4 h-4 text-amber-500 mr-1" />,
  "Team Member": <UserCircle className="inline-block w-4 h-4 text-green-500 mr-1" />,
};

const roleColors = {
  Admin: {
    bg: "bg-gradient-to-br from-red-50 to-red-100",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700"
  },
  Manager: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700"
  },
  "Team Member": {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700"
  }
};

function ProfilePage() {
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const res = await axios.get(`${API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
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
              {/* User Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <User size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Profile</h3>
              <p className="text-gray-600">Fetching your profile information...</p>
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

  const roleColor = roleColors[profile.role] || roleColors["Team Member"];

  return (
    <>
      <Navbar />
      <BackButton />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-10 items-start animate-fade-in">
          
          {/* RIGHT: Profile Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 w-full md:flex-[2]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <PencilLine size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Edit Profile</h2>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : profile.profilePicture || "https://via.placeholder.com/120x120?text=" + profile.name.charAt(0).toUpperCase()
                    }
                    alt="Profile"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors duration-200 shadow-lg">
                    <Camera size={18} />
                    <input
                      type="file"
                      hidden
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile Picture</h3>
                  <p className="text-gray-600">Click the camera icon to change your profile picture</p>
                </div>
              </div>

              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold text-gray-700 mb-2 block">Name</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <User size={20} className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      value={profile.name}
                      disabled
                      className="w-full outline-none bg-transparent text-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-2 block">Email</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <Mail size={20} className="text-gray-400 mr-3" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full outline-none bg-transparent text-gray-700 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Gender and Position Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold text-gray-700 mb-2 block">Gender</label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all duration-200">
                    <Venus size={20} className="text-gray-400 mr-3" />
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full outline-none text-gray-700 bg-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-2 block">Position</label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all duration-200">
                    <Briefcase size={20} className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      name="position"
                      value={profile.position || ""}
                      onChange={handleChange}
                      placeholder="e.g. Frontend Developer"
                      className="w-full outline-none text-gray-700 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 block">Date of Birth</label>
                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all duration-200">
                  <CalendarDays size={20} className="text-gray-400 mr-3" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth?.substring(0, 10)}
                    onChange={handleChange}
                    className="w-full outline-none text-gray-700 bg-transparent"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 block">Bio</label>
                <div className="relative">
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
                  />
                  <Quote size={16} className="absolute top-3 right-3 text-gray-400" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                >
                  <Save size={20} />
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          {/* LEFT: Profile Card - Same Design as Team Members */}
          <div className="w-full md:w-96">
            <div className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${roleColor.bg} ${roleColor.border} border-2`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-current to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-current to-transparent rounded-full translate-y-8 -translate-x-8"></div>
              </div>

              {/* Card Content */}
              <div className="relative p-6">
                {/* Profile Image and Basic Info Row */}
                <div className="flex items-center mb-4">
                  <div className="relative mr-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : profile.profilePicture || "https://via.placeholder.com/80x80?text=" + profile.name.charAt(0).toUpperCase()
                      }
                      alt={profile.name}
                      className="relative w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      {roleIcons[profile.role]}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors duration-300 truncate">
                      {profile.name}
                    </h2>
                    <div className="flex items-center space-x-1 mb-2">
                      <Mail size={14} className="text-gray-500 flex-shrink-0" />
                      <p className="text-xs text-gray-600 font-medium truncate">{profile.email}</p>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full ${roleColor.badge} font-semibold text-xs shadow-sm`}>
                      {roleIcons[profile.role]}
                      {profile.role}
                    </div>
                  </div>
                </div>

                {/* Profile Details - Compact Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {profile.position && (
                    <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                      <MapPin size={14} className="text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Position</p>
                        <p className="text-xs font-semibold text-gray-700 truncate">{profile.position}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.gender && (
                    <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                      <UserCircle size={14} className="text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Gender</p>
                        <p className="text-xs font-semibold text-gray-700 capitalize">{profile.gender}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.dateOfBirth && (
                    <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg backdrop-blur-sm col-span-2">
                      <CalendarDays size={14} className="text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                        <p className="text-xs font-semibold text-gray-700">
                          {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bio Section - Only if exists */}
                {profile.bio && (
                  <div className="relative p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                    <Quote size={12} className="absolute top-2 left-2 text-gray-400" />
                    <blockquote className="text-xs text-gray-700 italic pl-4">
                      "{profile.bio}"
                    </blockquote>
                  </div>
                )}

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProfilePage;
