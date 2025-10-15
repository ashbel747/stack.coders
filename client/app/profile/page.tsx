"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../lib/api";
import { User } from "../types/user";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [skills, setSkills] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getProfile(token).then((data) => {
      setUser(data);
      setSkills(data.skills.join(", "));
      setLoading(false);
    });
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    const token = localStorage.getItem("token")!;
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("skills", skills);
    if (file) formData.append("avatar", file);
    const updated = await updateProfile(token, formData);
    setUser(updated.user);
    alert("Profile updated successfully!");
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-md">
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <input
          type="text"
          value={user?.name || ""}
          onChange={(e) => setUser({ ...user!, name: e.target.value })}
          className="input"
        />
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="input"
        />
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
