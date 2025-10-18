"use client";
import { useState } from "react";
import { login } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(form.email, form.password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        data-testid="login-form"
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-100"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Login
        </h1>

        <input
          data-testid="email-input"
          type="email"
          placeholder="Email"
          className="input"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          className="input"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && <p data-testid="error-message" className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          data-testid="login-button"
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <p
          data-testid="forgot-password-link"
          onClick={() => router.push("/auth/forgot-password")}
          className="text-blue-600 text-sm mt-4 text-center cursor-pointer hover:underline"
        >
          Forgot Password?
        </p>
        <p
          data-testid="signup-link"
          onClick={() => router.push("/auth/signup")}
          className="text-blue-600 text-sm mt-4 text-center cursor-pointer hover:underline"
        >
          New here?
        </p>
      </form>
    </div>
  );
}
