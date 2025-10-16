// lib/api.ts
import axios from 'axios';
import { Project } from '../types/project';
import { AuthResponse } from '../types/user';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: BASE_URL,
});

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* Projects */
export const getAllProjects = async (): Promise<Project[]> => {
  const res = await api.get<Project[]>('/projects');
  return res.data;
};

export const getProject = async (id: string): Promise<Project> => {
  const res = await api.get<Project>(`/projects/${id}`);
  return res.data;
};

export const createProject = async (payload: Partial<Project>): Promise<{ message: string; project: Project }> => {
  const res = await api.post<{ message: string; project: Project }>('/projects/create', payload, {
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const updateProject = async (id: string, payload: Partial<Project>) => {
  const res = await api.patch<{ message: string; project: Project }>(`/projects/${id}`, payload, {
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await api.delete<{ message: string }>(`/projects/${id}`, {
    headers: { ...authHeaders() },
  });
  return res.data;
};

export const requestCollaboration = async (projectId: string) => {
  const res = await api.post(`/projects/${projectId}/request`, {}, { headers: { ...authHeaders() } });
  return res.data;
};

export const getMyProjects = async () => {
  const res = await api.get<{ message: string; total?: number; projects: Project[] }>(`/projects/personal`, {
    headers: { ...authHeaders() },
  });
  return res.data;
};

export const getNotifications = async () => {
  const res = await api.get<{ message: string; total: number; requests: any[] }>('/projects/notifications', {
    headers: { ...authHeaders() },
  });
  return res.data;
};

export const approveRequest = async (requestId: string) => {
  const res = await api.post(`/projects/requests/${requestId}/approve`, {}, { headers: { ...authHeaders() } });
  return res.data;
};

export const rejectRequest = async (requestId: string) => {
  const res = await api.post(`/projects/requests/${requestId}/reject`, {}, { headers: { ...authHeaders() } });
  return res.data;
};
