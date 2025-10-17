import React from "react";
import { getAllFeeds } from "../../lib/feed-api";
import FeedCard from "../FeedCard";

const FeedPage = async () => {
  const feeds = await getAllFeeds();

  return (
    <section className="min-h-screen bg-blue-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 text-center mb-10">
          Community Feed
        </h1>

        {feeds.length === 0 ? (
          <p className="text-center text-gray-600">No news available yet.</p>
        ) : (
          <div className="space-y-6">
            {feeds.map((feed: any) => (
              <FeedCard key={feed._id} feed={feed} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedPage;
