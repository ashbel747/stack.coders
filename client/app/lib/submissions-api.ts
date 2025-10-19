import { ContactFormData } from "../types/contacts";

const API_URL = 'https://stack-coders-services.onrender.com/';

export async function sendContactForm(data: ContactFormData) {
  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to send message');
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}