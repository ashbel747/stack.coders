"use client";

import { useState, useRef } from "react";
import { sendContactForm } from "../../lib/submissions-api";
import { ContactFormData } from "../../types/contacts";
import { motion, useInView } from "framer-motion";

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await sendContactForm(form);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Animation setup
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full border border-blue-100"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold text-blue-700 text-center mb-6"
        >
          Contact us for any comments or suggestions here!
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full p-3 border border-blue-200 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>

          {success && (
            <p className="text-green-600 text-center font-medium mt-3">
              {success}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-center font-medium mt-3">
              {error}
            </p>
          )}
        </motion.form>
      </motion.div>
    </section>
  );
}
