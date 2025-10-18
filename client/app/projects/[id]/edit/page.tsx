"use client";

import React, { useEffect, useState } from "react";
import { getProject, updateProject } from "../../../lib/project-api";
import { useRouter, useParams } from "next/navigation";

const EditProjectPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const loadProject = async () => {
      try {
        const project = await getProject(id);
        setForm({
          title: project.title || "",
          description: project.description || "",
          deadline: project.deadline ? project.deadline.split("T")[0] : "",
          requiredSkills: (project.requiredSkills || []).join(", "),
          category: project.category || "",
          teamSize: project.teamSize || 1,
          techStack: (project.techStack || []).join(", "),
          githubRepo: project.githubRepo || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load project. Please check your login or try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleChange = (k: string, v: any) =>
    setForm((prev: any) => ({ ...prev, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      await updateProject(id, {
        title: form.title,
        description: form.description,
        category: form.category,
        teamSize: Number(form.teamSize),
        githubRepo: form.githubRepo || undefined,
        deadline: form.deadline || undefined,
        requiredSkills: form.requiredSkills
          ? form.requiredSkills.split(",").map((s: string) => s.trim())
          : [],
        techStack: form.techStack
          ? form.techStack.split(",").map((s: string) => s.trim())
          : [],
      });

      alert("Project updated successfully!");
      router.push("/projects/personal");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed. Try again later.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form)
    return <div className="p-6 text-gray-600">Loading project...</div>;

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6 flex justify-center mt-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-blue-100 p-8">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
          Edit Your Project
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Update your project details below.
        </p>

        <form onSubmit={submit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              rows={4}
              required
            />
          </div>

          {/* Deadline + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700">
                Deadline
              </label>
              <input
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
                type="text"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Team Size + Required Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700">
                Team Size
              </label>
              <input
                type="number"
                min={1}
                value={form.teamSize}
                onChange={(e) => handleChange("teamSize", e.target.value)}
                className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700">
                Required Skills
              </label>
              <input
                type="text"
                value={form.requiredSkills}
                onChange={(e) =>
                  handleChange("requiredSkills", e.target.value)
                }
                className="mt-1 w-full border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 px-3 py-2 rounded-lg"
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>
          </div>

          {/* GitHub Repo */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">
              GitHub Repository
            </label>
            <input
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
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectPage;
