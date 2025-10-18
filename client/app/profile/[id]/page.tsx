"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserProfile } from "../../lib/api";
import { User } from "../../types/user";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view profiles.");
      setLoading(false);
      return;
    }

    getUserProfile(id as string, token)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user profile.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading profile...</p>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-100 space-y-4">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
          {user.name}'s Profile
        </h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src={user?.avatar || "/default-avatar.jpg"}
            alt={user?.name || "User avatar"}
            className="rounded-full object-cover border-2 border-gray-800"
            width={64}
            height={64}
          />
          <p className="text-gray-600 mt-2 capitalize text-sm">Role:<span className="font-bold">{user.role}</span></p>
        </div>

        {/* Info Section */}
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center text-gray-700">
            <UserIcon className="w-5 h-5 text-blue-600 mr-3" />
            <span>{user.description}</span>
          </div>

          {/* Email */}
          <div className="flex items-center text-gray-700">
            <Mail className="w-5 h-5 text-blue-600 mr-3" />
            <a
              href={user.email}
              className="text-blue-700 hover:text-blue-600 transition-colors"
            >
              {user.email}
            </a>
          </div>

          {/* Phone */}
          {user.phone && (
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 text-blue-600 mr-3" />
              <a
                href={`tel:${user.phone}`}
                className="text-blue-700 hover:text-blue-600 transition-colors"
              >
                {user.phone}
              </a>
            </div>
          )}

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-4 border-t border-blue-100">
          <UserIcon className="inline-block w-4 h-4 mr-1" />
          Member ID: {user._id}
        </div>
      </div>
    </div>
  );
}
