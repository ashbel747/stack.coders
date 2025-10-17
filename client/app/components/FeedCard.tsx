"use client";

import React, { useRef } from "react";
import { Feed } from "../types/feed";
import { motion, useInView } from "framer-motion";

interface FeedCardProps {
  feed: Feed;
}

const FeedCard: React.FC<FeedCardProps> = ({ feed }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const formattedDate = new Date(feed.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-transform duration-200"
    >
      <h3 className="text-2xl font-semibold text-blue-600 mb-2">{feed.title}</h3>
      <p className="text-gray-700 mb-4">{feed.description}</p>
      <span className="text-sm text-gray-500">{formattedDate}</span>
    </motion.div>
  );
};

export default FeedCard;
