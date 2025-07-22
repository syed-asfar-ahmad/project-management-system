import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const API = process.env.REACT_APP_API_BASE_URL;

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    position: "",
    role: "Team Member", // hardcoded default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") setTouched(true);
  };

  const isValidPassword = () => {
    const { password } = form;
    return (
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      password.length >= 8
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPassword()) {
      toast.error("Password does not meet security requirements.");
      return;
    }

    try {
      await axios.post(`${API}/auth/register`, form);
      toast.success("Signup successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const passwordChecks = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
    { label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "One number (0-9)", test: (p) => /\d/.test(p) },
    { label: "One special character (!@#$%^&*)", test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h1>
        <p className="text-center text-gray-500 mb-6">Sign up to get started with TaskPilot</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-green-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-green-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-green-400 pr-10"
            />
            <span
              className="absolute right-3 top-[37px] cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>

            {/* Password rules */}
            {touched && (
              <ul className="mt-2 space-y-1 text-sm">
                {passwordChecks.map((check, index) => (
                  <li key={index} className={check.test(form.password) ? "text-green-600" : "text-red-500"}>
                    • {check.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-green-400"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Position */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Position</label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              placeholder="e.g. Frontend Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-green-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
