"use client";
// pages/projects/create.tsx
import React, { useState } from 'react';
import { createProject } from '../../lib/project-api';
import { useRouter } from 'next/navigation';

const CreateProjectPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    requiredSkills: '',
    category: '',
    teamSize: 1,
    techStack: '',
    githubRepo: '',
  });

  const handleChange = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        requiredSkills: form.requiredSkills ? form.requiredSkills.split(',').map(s => s.trim()) : [],
        category: form.category,
        teamSize: Number(form.teamSize),
        techStack: form.techStack ? form.techStack.split(',').map(s => s.trim()) : undefined,
        githubRepo: form.githubRepo || undefined,
      };
      await createProject(payload);
      router.push('/projects/personal');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <h1 className="text-2xl font-bold mb-6">Create Project</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={form.title} onChange={e => handleChange('title', e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" rows={4} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Deadline</label>
            <input type="date" value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Category</label>
            <input value={form.category} onChange={e => handleChange('category', e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Team Size</label>
            <input type="number" min={1} value={form.teamSize} onChange={e => handleChange('teamSize', e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm">Required Skills (comma separated)</label>
            <input value={form.requiredSkills} onChange={e => handleChange('requiredSkills', e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm">Tech Stack (comma separated)</label>
          <input value={form.techStack} onChange={e => handleChange('techStack', e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </>  
  );
};

export default CreateProjectPage;
