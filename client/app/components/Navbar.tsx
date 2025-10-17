"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { getNotifications } from "../lib/project-api";
import { User } from "../types/user";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const loadUserAndNotifications = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser: User = JSON.parse(userData);
          setUser(parsedUser);

          // Fetch notifications
          const res = await getNotifications();
          setNotifications(res.total || 0);
        } catch (error) {
          console.error("Error loading user or notifications:", error);
        }
      } else {
        setUser(null);
      }
    };

    loadUserAndNotifications();

    // Reactively listen to login/logout from other tabs
    const handleStorageChange = () => loadUserAndNotifications();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  if (!mounted) return null; // Prevent hydration mismatch on SSR

  return (
    <nav className="bg-white shadow-md border-b border-blue-100 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Stack Coders
        </Link>

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          {!user ? (
            <>
              <Link
                href="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              {/* 🔹 Project Management Buttons */}
              <Link
                href="/projects/create"
                className="text-blue-700 font-medium hover:text-blue-900 transition"
              >
                New Project
              </Link>
              <Link
                href="/projects"
                className="text-blue-700 font-medium hover:text-blue-900 transition"
              >
                All Projects
              </Link>
              <Link
                href="/projects/personal"
                className="text-blue-700 font-medium hover:text-blue-900 transition"
              >
                My Projects
              </Link>

              {/* 🔹 Notifications */}
              <Link
                href="/projects/notifications"
                className="relative flex items-center"
              >
                <Bell className="w-6 h-6 text-blue-600 hover:text-blue-800 transition" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Link>

              {/* 🔹 Profile + Logout */}
              <div className="flex items-center space-x-3">
                {user.avatar && (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="rounded-full border border-blue-400"
                  />
                )}
                <span className="font-medium text-blue-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
