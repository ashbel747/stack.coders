"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyCodeForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/auth/verify-code", { email, code });
      setMessage("Code verified! Redirecting to reset password...");
      setTimeout(() => router.push("/auth/reset-password"), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Invalid code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-100"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Verify Code
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter verification code"
          className="input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        {message && <p className="text-blue-600 text-sm mb-2">{message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Verify Code
        </button>
      </form>
    </div>
  );
}
