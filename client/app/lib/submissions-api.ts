import axios from "axios";
import { ContactFormData } from "../types/contacts";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendContactForm = async (data: ContactFormData): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const res = await api.post("/contact", data);
    return res.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      "Something went wrong! Please try again later.";
    throw new Error(msg);
  }
};
