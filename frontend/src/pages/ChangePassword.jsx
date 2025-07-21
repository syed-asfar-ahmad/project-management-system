import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [valid, setValid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "newPassword") {
      const value = e.target.value;
      const validLength = value.length >= 8;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*]/.test(value);

      if (validLength && hasUpper && hasLower && hasNumber && hasSpecial) {
        setPasswordError("");
      } else {
        setPasswordError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setChecking(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/verify-password`, {
        email: form.email,
        currentPassword: form.currentPassword,
      });

      if (res.data.success) {
        setValid(true);
        setStep(2);
        toast.success("You can now set a new password.");
      } else {
        toast.error(res.data.message || "Incorrect password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setChecking(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordError) return;

    setUpdating(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/change-password`, form);
      toast.success(res.data.message);
      setForm({ email: "", currentPassword: "", newPassword: "" });
      setStep(1);
      setValid(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error changing password");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Change Your Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleVerify} className="space-y-5">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your registered email"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={checking}
            >
              {checking ? "Verifying..." : "Verify Password"}
            </button>
          </form>
        )}

        {step === 2 && valid && (
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <p className="text-green-600 text-center font-medium">
              First or last 4 characters matched. You can change your password.
            </p>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              disabled={updating || !!passwordError}
            >
              {updating ? "Updating..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
