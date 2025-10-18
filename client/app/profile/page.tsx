"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../lib/api";
import { User } from "../types/user";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [skills, setSkills] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getProfile(token)
      .then((data) => {
        setUser(data);
        setSkills(data.skills?.join(", ") || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setRole(data.role || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Update profile
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in again.");

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", email);
    formData.append("skills", skills);
    formData.append("phone", phone);
    formData.append("role", role);
    if (file) formData.append("avatar", file);

    try {
      const updated = await updateProfile(token, formData);
      setUser(updated.user);
      setSuccess("Profile updated successfully!");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Try again.");
      setSuccess(null);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-10 px-4">
      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-100 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          My Profile
        </h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <Image
            src={user?.avatar || "/default-avatar.jpg"}
            alt="avatar"
            className="rounded-full object-cover border-2 border-gray-800"
            width={64}
            height={64}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-2 text-sm text-gray-600"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            data-testid="name-input"
            type="text"
            value={user?.name || ""}
            onChange={(e) => setUser({ ...user!, name: e.target.value })}
            placeholder="Enter your full name"
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1">
            <PhoneInput
              country={"ke"}
              value={phone}
              onChange={(value: string) => setPhone(`+${value}`)}
              inputStyle={{
                width: "100%",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                paddingLeft: "48px",
                height: "42px",
                fontSize: "14px",
              }}
              buttonStyle={{
                border: "1px solid #d1d5db",
                backgroundColor: "white",
              }}
              dropdownStyle={{
                zIndex: 50,
              }}
              inputProps={{
                name: "phone",
                required: true,
              }}
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills (comma separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, Node.js, MongoDB"
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="dev">Developer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Success & Error */}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        {error && <p data-testid="error-profile" className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            data-testid="update"
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
