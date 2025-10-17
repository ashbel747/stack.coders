import axios from "axios";
import { Feed } from "../types/feed";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all community feed posts
 */
export async function getAllFeeds(): Promise<Feed[]> {
  try {
    const res = await api.get<Feed[]>("/feed");
    return res.data;
  } catch (error: any) {
    console.error("Error fetching feeds:", error.message || error);
    throw new Error("Failed to fetch feeds");
  }
}
