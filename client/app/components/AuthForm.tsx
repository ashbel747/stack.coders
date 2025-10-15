"use client";

import { useState } from "react";
import { signup, login } from "../lib/api";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "signup" | "login";
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (type === "signup") {
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (avatar) formData.append("avatar", avatar);
        const res = await signup(formData);
        localStorage.setItem("token", res.token);
        router.push("/profile");
      } else {
        const res = await login(form.email, form.password);
        localStorage.setItem("token", res.token);
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-100"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          {type === "signup" ? "Create Account" : "Login"}
        </h1>

        {type === "signup" && (
          <input
            type="text"
            placeholder="Full Name"
            className="input"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="input"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {type === "signup" && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />

            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="input"
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="mb-4 w-full"
            />
          </>
        )}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Please wait..." : type === "signup" ? "Sign Up" : "Login"}
        </button>
      </form>
    </div>
  );
}
