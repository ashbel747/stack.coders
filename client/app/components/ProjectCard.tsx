"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Project } from "../types/project";
import { getProfile } from "../lib/api";
import { User } from "../types/user";
import { requestCollaboration } from "../lib/project-api";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  onDelete?: (id: string) => void; // ✅ added delete handler
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showActions = false,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getProfile(token)
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const teamMembers = project.teamMembers || [];
  const hasTeamMembers = teamMembers.length > 0;
  const hasGithubRepo = Boolean(project.githubRepo);

  const ownerId =
    typeof project.owner === "string" ? project.owner : project.owner?._id;

  const isOwner = user?._id === ownerId; // ✅ check if current user is owner

  const handleRequest = async () => {
    try {
      setLoading(true);
      const res = await requestCollaboration(project._id);
      setMessage(res.message);
      setRequestSent(true);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100 transition hover:shadow-lg hover:border-blue-300">
      {/* --- Title & Description --- */}
      <h2 className="text-xl font-semibold text-blue-800 mb-2">
        {project.title}
      </h2>
      <p className="text-gray-700 mb-3 text-sm">{project.description}</p>

      {/* --- Basic Details --- */}
      {project.category && (
        <p className="text-sm text-gray-600 mb-2">
          <strong className="text-blue-700">Category:</strong> {project.category}
        </p>
      )}
      <p className="text-sm text-gray-600 mb-4">
        <strong className="text-blue-700">Team Size:</strong> {project.teamSize}
      </p>

      {/* --- Required Skills Section --- */}
      {project.requiredSkills && project.requiredSkills.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-blue-700 font-semibold mb-2">
            Required Skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* --- Collaboration Info --- */}
      {(hasGithubRepo || hasTeamMembers) && (
        <div className="mb-4 bg-blue-50 rounded-lg p-3">
          {hasGithubRepo && (
            <p className="text-sm mb-2">
              <strong className="text-blue-700">GitHub:</strong>{" "}
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {project.githubRepo}
              </a>
            </p>
          )}

          {hasTeamMembers && (
            <div className="text-sm text-gray-700">
              <strong className="text-blue-700">Team Members:</strong>{" "}
              {teamMembers.map((member, i) => {
                const memberId =
                  typeof member === "string" ? member : member._id;
                const memberName =
                  typeof member === "string"
                    ? "Unnamed"
                    : member.name || member.email || "Unnamed";

                return (
                  <Link
                    key={memberId}
                    href={`/profile/${memberId}`}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    {memberName}
                    {i < teamMembers.length - 1 ? "," : ""}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- Feedback Message --- */}
      {message && (
        <p className="text-sm text-green-600 font-medium mb-2">{message}</p>
      )}

      {/* --- Collaboration Options ---*/}
      {!showActions && (
        <>
          {isOwner ? (
            <p className="text-sm font-bold text-gray-900">
              You own this project.
            </p>
          ) : project.collaborationActive ? (
            <p className="text-sm text-gray-500 italic">
              You are allowed to collaborate with other invited developers on
              this project.
            </p>
          ) : (
            <button
              onClick={handleRequest}
              disabled={loading || requestSent}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : requestSent
                ? "Request Sent"
                : "Request Collaboration"}
            </button>
          )}
        </>
      )}

      {/* --- Owner Actions (Edit/Delete) --- */}
      {isOwner && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push(`/projects/${project._id}/edit/`)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(project._id)}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
