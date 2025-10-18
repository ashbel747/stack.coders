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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-600 text-lg font-medium">Loading projects...</p>
      </div>
    );
  }

  return (
    <div data-testid="my-projects-page" className="min-h-screen bg-blue-50 py-10 px-6 mt-10">
      <h1 data-testid="my-projects-title" className="text-3xl font-bold text-blue-700 text-center mb-2">
        My Projects
      </h1>
      <p className="text-center text-gray-600 mb-8">
        View and manage your personal projects.
      </p>

      <div className="flex justify-center mb-8">
        <button
          data-testid="new-project-button"
          onClick={() => router.push("/projects/create")}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
        >
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-600">You haven't created any projects yet.</p>
      ) : (
        <div data-testid="project-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p._id}
            >
              <ProjectCard project={p} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
