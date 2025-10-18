import React from "react";
import { getAllFeed } from "../lib/feed-api";
import FeedCard from "../components/FeedCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Feed | Stack Coders",
  description:
    "Stay updated with the latest developer news, projects, and insights from the Stack Coders community.",
  openGraph: {
    title: "Community Feed | Stack Coders",
    description:
      "Stay updated with the latest developer news, projects, and insights from the Stack Coders community.",
    url: "https://stackcoders.vercel.app/feed",
    siteName: "Stack Coders",
    images: [
      {
        url: "https://stackcoders.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stack Coders Community Feed",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Coders — Community Feed",
    description:
      "Explore developer stories, projects, and updates from the Stack Coders community.",
    images: ["https://stackcoders.vercel.app/og-image.png"],
  },
};

const FeedPage = async () => {
  const feeds = await getAllFeed();

  return (
    <section data-testid="community-feed-section" className="min-h-screen bg-blue-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 data-testid="feed-title" className="text-4xl font-bold text-blue-700 text-center mb-10">
          Community Feed
        </h1>

        {feeds.length === 0 ? (
          <p data-testid="no-feed-message" className="text-center text-gray-600">No news available yet.</p>
        ) : (
          <div data-testid="feed-list" className="space-y-6">
            {feeds.map((feed: any) => (
              <FeedCard data-testid={`feed-card-${feed._id}`} key={feed._id} feed={feed} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedPage;
