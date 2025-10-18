"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../lib/project-api";

const CreateProjectPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    requiredSkills: "",
    category: "",
    teamSize: 1,
    githubRepo: "",
  });

  const handleChange = (k: string, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        teamSize: Number(form.teamSize),
        githubRepo: form.githubRepo || undefined,
        deadline: form.deadline || undefined,
        requiredSkills: form.requiredSkills
          ? form.requiredSkills.split(",").map((s) => s.trim())
          : [],
      };

      await createProject(payload);
      router.push("/projects/personal");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6 flex justify-center mt-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-blue-100 p-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
          Ready to build something amazing?
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Fill out the details below to create your project.
        </p>

        <form onSubmit={submit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Title
            </label>
            <input
              data-testid="title-input"
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              required
              placeholder="Title of your project"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Description
            </label>
            <textarea
              data-testid="description-input"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              rows={4}
              required
              placeholder="Briefly describe your project idea..."
            />
          </div>

          {/* Deadline + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700">
                Deadline
              </label>
              <input
                data-testid="deadline-input"
                type="date"
                value={form.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700">
                Category
              </label>
              <input
                data-testid="category-input"
                type="text"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
                required
                placeholder="e.g. Web Development"
              />
            </div>
          </div>

          {/* Team size */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Team Size
            </label>
            <input
              data-testid="team-size-input"
              type="number"
              min={1}
              value={form.teamSize}
              onChange={(e) => handleChange("teamSize", e.target.value)}
              className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              required
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Required Skills
            </label>
            <input
              data-testid="skills-input"
              type="text"
              value={form.requiredSkills}
              onChange={(e) => handleChange("requiredSkills", e.target.value)}
              className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              placeholder="e.g. React, Node.js, MongoDB"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate skills with commas (e.g. React, Tailwind, Node.js)
            </p>
          </div>

          {/* GitHub Repo */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">
              GitHub Repository
            </label>
            <input
              data-testid="github-input"
              type="url"
              value={form.githubRepo}
              onChange={(e) => handleChange("githubRepo", e.target.value)}
              className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              placeholder="https://github.com/yourusername/yourproject"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              data-testid="create-project-button"
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
