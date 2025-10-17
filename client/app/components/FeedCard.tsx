import React from "react";
import { Feed } from "../types/feed";

interface FeedCardProps {
  feed: Feed;
}

const FeedCard: React.FC<FeedCardProps> = ({ feed }) => {
  const formattedDate = new Date(feed.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition-all duration-200">
      <h3 className="text-2xl font-semibold text-blue-600 mb-2">{feed.title}</h3>
      <p className="text-gray-700 mb-4">{feed.description}</p>
      <span className="text-sm text-gray-500">{formattedDate}</span>
    </div>
  );
};

export default FeedCard;
