"use client";

import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import { getMyProjects, deleteProject } from "../../lib/project-api";
import { Project } from "../../types/project";
import { useRouter } from "next/navigation";

const MyProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyProjects();
      setProjects(res.projects || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load your projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <button
          onClick={() => router.push("/projects/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          New Project
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-600">No projects yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              canEdit
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
