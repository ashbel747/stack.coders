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

  if (!mounted) return null;

  return (
    <nav className="bg-white shadow-md border-b border-blue-100 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span className="text-blue-700">&lt;/&gt;</span>
          Stack Coders
        </Link>

        {/* 🔹 When NOT logged in (any device) */}
        {!user && (
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get started
          </Link>
        )}

        {/* When logged in — Mobile View */}
        {user && (
          <div className="flex items-center space-x-4 md:hidden">
            {/* Dashboard link */}
            <Link
              href="/dashboard"
              className="text-blue-700 font-medium hover:text-blue-900 transition"
            >
              Dashboard
            </Link>

            {/* Profile avatar (no username on small devices) */}
            <Link
              href="/profile"
              className="flex items-center hover:opacity-80 transition"
            >
              <Image
                src={user?.avatar || "/default-avatar.jpg"}
                alt={user?.name || "User avatar"}
                width={36}
                height={36}
                className="rounded-full border border-gray-900"
              />
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-red-500 font-medium hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}

        {/* When logged in — Desktop View */}
        {user && (
          <div className="hidden md:flex items-center space-x-6">
            {/* Project Links */}
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

            {/* Notifications */}
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

            {/* Profile + Logout */}
            <div className="flex items-center space-x-3">
              <Link
                href="/profile"
                className="flex items-center space-x-2 hover:opacity-80 transition"
              >
                <Image
                  src={user?.avatar || "/default-avatar.jpg"}
                  alt={user?.name || "User avatar"}
                  width={36}
                  height={36}
                  className="rounded-full border border-gray-900"
                />
                {/* Username only visible on large devices */}
                <span className="font-medium text-blue-700 hidden lg:inline">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 font-medium hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
