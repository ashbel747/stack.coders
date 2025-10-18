"use client";

import React, { useEffect, useState } from "react";
import { getAllProjects } from "../lib/project-api";
import { Project } from "../types/project";
import ProjectCard from "../components/ProjectCard";

const AllProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-600 text-lg font-medium">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6 mt-10">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
        All Projects
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Explore all community projects and find one to collaborate on!
      </p>

      {projects.length === 0 ? (
        <p className="text-center text-gray-600">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProjectsPage;
