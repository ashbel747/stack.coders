"use client";

import React from "react";
import Link from "next/link";
import { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
  canEdit?: boolean;
  onDelete?: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, canEdit, onDelete }) => {
  return (
    <div className="p-4 bg-white rounded shadow hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
      <p className="text-gray-600 mb-3">{project.description}</p>
      <div className="text-sm text-gray-500 mb-4">
        <p><strong>Category:</strong> {project.category}</p>
        <p><strong>Deadline:</strong> {project.deadline || "N/A"}</p>
        <p><strong>Team Size:</strong> {project.teamSize}</p>
      </div>

      {canEdit && (
        <div className="flex gap-2">
          <Link
            href={`/projects/${project._id}/edit`}
            className="px-3 py-1 rounded border text-sm hover:bg-gray-100 transition"
          >
            Edit
          </Link>

          <button
            onClick={() => onDelete && onDelete(project._id)}
            className="px-3 py-1 rounded border text-sm text-red-600 hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
