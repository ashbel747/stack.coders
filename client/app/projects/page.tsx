"use client";
// pages/projects/index.tsx
import React, { useEffect, useState } from 'react';
import { getAllProjects } from '../lib/project-api';
import { Project } from '../types/project';
import ProjectCard from '../components/ProjectCard';

const AllProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
        <h1 className="text-2xl font-bold mb-4">All Projects</h1>
        {loading ? <div>Loading...</div> : (
            projects.length === 0 ? <div>No projects yet.</div> : (
            <div className="grid md:grid-cols-2 gap-4">
                {projects.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
            )
        )}
    </>
  );
};

export default AllProjectsPage;
