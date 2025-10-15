"use client";

import { useEffect, useState } from "react";
import { getAllMembers } from "../lib/api";
import { User } from "../types/user";

export default function MembersPage() {
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    getAllMembers().then(setMembers);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Members</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <div key={m._id} className="bg-white shadow-md rounded-xl p-4 border border-blue-100">
            <img
              src={m.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover mb-2"
            />
            <h2 className="font-semibold text-blue-800">{m.name}</h2>
            <p className="text-sm text-gray-600">{m.email}</p>
            <p className="text-sm text-gray-700 mt-1">
              Skills: {m.skills.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
