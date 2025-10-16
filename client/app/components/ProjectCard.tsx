// components/ProjectCard.tsx
"use client";
import React, { useState } from "react";
import { Project } from "../types/project";
import { requestCollaboration } from "../lib/project-api";

interface ProjectCardProps {
  project: Project;
  showActions?: boolean; // optional prop for edit/delete in personal page
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, showActions = false }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRequest = async () => {
    try {
      setLoading(true);
      const res = await requestCollaboration(project._id);
      setMessage(res.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">{project.title}</h2>
      <p className="text-gray-700 mb-3">{project.description}</p>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Category:</strong> {project.category}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <strong>Team Size:</strong> {project.teamSize}
      </p>

      {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

      {!showActions && (
        <button
          onClick={handleRequest}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Request Collaboration"}
        </button>
      )}

      {showActions && (
        <div className="flex gap-3">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
            Edit
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
