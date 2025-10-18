"use client";

import { useEffect, useState } from "react";
import { getMyFeed, createFeed, deleteFeed } from "../../lib/feed-api";
import { Feed } from "../../types/feed";

export default function MyFeedPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchFeeds = async () => {
    if (!token) return;
    const data = await getMyFeed(token);
    setFeeds(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleCreate = async () => {
    if (!title || !description) return alert("Please fill all fields");
    if (!token) return alert("Unauthorized");

    await createFeed(token, { title, description });
    setTitle("");
    setDescription("");
    fetchFeeds();
  };

  const handleDelete = async (id: string) => {
    if (!token) return alert("Unauthorized");
    await deleteFeed(token, id);
    fetchFeeds();
  };

  if (loading)
    return <p className="text-center mt-10 text-blue-600 font-medium">Loading your posts...</p>;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6 mt-10">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        Community Feed
      </h1>

      {/* Create Post */}
      <div data-testid="create-post-form" className="bg-white shadow-md rounded-xl p-6 border border-blue-100 mb-10 max-w-xl mx-auto">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">Create New Post</h2>
        <input
          data-testid="title-input"
          type="text"
          placeholder="Title"
          className="w-full border border-blue-200 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          data-testid="description-input"
          placeholder="Description"
          className="w-full border border-blue-200 rounded-lg p-2 mb-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          data-testid="post-button"
          onClick={handleCreate}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post
        </button>
      </div>

      {/* User Feed List */}
      {feeds.length === 0 ? (
        <p className="text-center text-gray-600">No posts yet. Create your first post!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <h1 className="text-xl font-bold text-blue-700 text-center mb-6">
            My posts
          </h1>
          {feeds.map((f) => (
            <div
              data-testid="myfeed-card"
              key={f._id}
              className="bg-white shadow-md rounded-xl p-6 border border-blue-100 transition hover:shadow-lg hover:border-blue-300"
            >
              <h2 className="text-blue-800 font-semibold text-lg mb-2">{f.title}</h2>
              <p className="text-gray-700 text-sm line-clamp-2">{f.description}</p>
              <p className="text-xs text-gray-500 mt-3">
                {new Date(f.createdAt).toLocaleString()}
              </p>
              <button
                data-testid={`delete-button-${f._id}`}
                onClick={() => handleDelete(f._id)}
                className="mt-4 w-full bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
