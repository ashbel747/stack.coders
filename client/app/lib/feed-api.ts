import axios from "axios";
import { Feed } from "../types/feed";

const BASE_URL = "http://localhost:4000"; // 👈 Same as your auth API

const api = axios.create({
  baseURL: BASE_URL,
});

// 🟦 Get all feed posts (public)
export const getAllFeed = async (): Promise<Feed[]> => {
  const res = await api.get<Feed[]>("/feed");
  return res.data;
};

// 🟦 Get logged-in user's personal feed
export const getMyFeed = async (token: string): Promise<Feed[]> => {
  const res = await api.get<Feed[]>("/feed/my-posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 🟩 Create a new feed post
export const createFeed = async (
  token: string,
  data: { title: string; description: string }
): Promise<Feed> => {
  const res = await api.post<Feed>("/feed", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 🟥 Delete a feed post
export const deleteFeed = async (
  token: string,
  id: string
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/feed/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
