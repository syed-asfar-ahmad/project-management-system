import { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Team Member",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Signup successful");
      console.log(res.data);
    } catch (err) {
      alert("Signup failed");
      console.error(err.response?.data);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full mb-3 p-2 border rounded"
          value={form.role}
          onChange={handleChange}
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Team Member">Team Member</option>
        </select>

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
