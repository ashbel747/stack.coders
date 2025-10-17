import axios from "axios";
import { AuthResponse, User } from "../types/user";

const BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const signup = async (formData: FormData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", { email, password });
  return res.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return res.data;
};

export const getProfile = async (token: string): Promise<User> => {
  const res = await api.get<User>("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUserProfile = async (id: string, token: string): Promise<User> => {
  const res = await api.get(`/auth/profile/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (
  token: string,
  formData: FormData
): Promise<{ message: string; user: User }> => {
  const res = await api.patch<{ message: string; user: User }>("/auth/update", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAllMembers = async (token:string): Promise<{ totalMembers: number; users: User[] }> => {
  const res = await api.get<{ totalMembers: number; users: User[] }>('/auth/all', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
