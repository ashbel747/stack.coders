"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllMembers } from "../lib/api";
import { User } from "../types/user";

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<User[]>([]);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const { users, totalMembers } = await getAllMembers(token);
        setMembers(users);
        setTotalMembers(totalMembers);
      } catch (err) {
        console.error(err);
        setError("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-600 text-lg font-medium">Loading members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6 mt-10">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
        Members
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Total Members: <span className="font-semibold text-blue-700">{totalMembers}</span>
      </p>

      {members.length === 0 ? (
        <p className="text-center text-gray-600">No members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <div
              key={m._id}
              onClick={() => router.push(`/profile/${m._id}`)}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 border border-blue-100 transition hover:shadow-lg hover:border-blue-300"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={m.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                />
                <div>
                  <h2 className="font-semibold text-blue-800 text-lg">
                    {m.name}
                  </h2>
                  <p className="text-gray-500 text-sm capitalize">{m.role}</p>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-gray-700 text-sm line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap"
                title={m.description}
              >
                {m.description || "No description provided."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
