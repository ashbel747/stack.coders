"use client";

import React, { useEffect, useState } from "react";
import { getProject, updateProject } from "../../../lib/project-api";
import { useRouter, useParams } from "next/navigation";

const EditProjectPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const loadProject = async () => {
      try {
        const p = await getProject(id);
        setForm({
          title: p.title,
          description: p.description,
          deadline: p.deadline ? p.deadline.split("T")[0] : "",
          requiredSkills: (p.requiredSkills || []).join(", "),
          category: p.category,
          teamSize: p.teamSize,
          techStack: (p.techStack || []).join(", "),
          githubRepo: p.githubRepo || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load project");
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

    try {
      await updateProject(id, {
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        requiredSkills: form.requiredSkills
          ? form.requiredSkills.split(",").map((s: string) => s.trim())
          : [],
        category: form.category,
        teamSize: Number(form.teamSize),
        techStack: form.techStack
          ? form.techStack.split(",").map((s: string) => s.trim())
          : [],
        githubRepo: form.githubRepo || "",
      });

      alert("Project updated successfully!");
      router.push("/projects/personal");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading || !form)
    return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow-sm space-y-4"
      >
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Project Title"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Project Description"
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="Category"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            min={1}
            value={form.teamSize}
            onChange={(e) => handleChange("teamSize", e.target.value)}
            placeholder="Team Size"
            className="w-full border p-2 rounded"
          />
          <input
            value={form.requiredSkills}
            onChange={(e) =>
              handleChange("requiredSkills", e.target.value)
            }
            placeholder="Required Skills (comma separated)"
            className="w-full border p-2 rounded"
          />
        </div>

        <input
          value={form.techStack}
          onChange={(e) => handleChange("techStack", e.target.value)}
          placeholder="Tech Stack (comma separated)"
          className="w-full border p-2 rounded"
        />

        <input
          value={form.githubRepo}
          onChange={(e) => handleChange("githubRepo", e.target.value)}
          placeholder="GitHub Repository URL"
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;