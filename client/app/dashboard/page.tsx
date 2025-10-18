"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProfile } from "../lib/api";
import { User } from "../types/user";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }
        const profile = await getProfile(token);
        setUser(profile);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <p className="text-blue-600 text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  // Define quick action cards
  const quickActions =
    user.role === "admin"
      ? [
          { title: "Create Project", link: "/projects/create", color: "bg-blue-600" },
          { title: "My Projects", link: "/projects/personal", color: "bg-blue-500" },
          { title: "All Projects", link: "/projects", color: "bg-blue-400" },
          { title: "Community Feed", link: "/feed/my-feed", color: "bg-blue-600" },
          { title: "Members", link: "/members", color: "bg-blue-500" },
        ]
      : [
          { title: "Create Project", link: "/projects/create", color: "bg-blue-600" },
          { title: "My Projects", link: "/projects/personal", color: "bg-blue-500" },
          { title: "All Projects", link: "/projects", color: "bg-blue-400" },
        ];

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6 mt-10">
      {/* Welcome Message */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Dashboard
        </h1>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          Welcome back, {user.name}!
        </h2>
        <p className="text-gray-600">
          ROLE: <span className="capitalize font-semibold text-blue-700">{user.role}</span>
        </p>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
        Quick Actions:
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.link}>
            <div
              className={`${action.color} cursor-pointer text-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1`}
            >
              <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-blue-100">
                Go to {action.title.toLowerCase()} page
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Optional footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 text-gray-500 text-sm text-center">
        <p>{new Date().getFullYear()} Built with passion by the Stack Coders Admin Team.</p>
      </div>
    </div>
  );
}
