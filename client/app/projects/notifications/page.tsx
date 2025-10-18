"use client";
import React, { useEffect, useState } from "react";
import {
  getNotifications,
  approveRequest,
  rejectRequest,
} from "../../lib/project-api";

const NotificationsPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setRequests(res.requests || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      await approveRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Approve failed");
    }
  };

  const reject = async (id: string) => {
    try {
      await rejectRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Reject failed");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6 mt-10">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
        Notifications
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Manage your pending collaboration requests here.
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-blue-600 text-lg font-medium">
            Loading notifications...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-600 bg-white py-6 px-4 rounded-xl shadow-sm max-w-md mx-auto">
          No pending requests.
        </div>
      ) : (
        <div className="space-y-5 max-w-3xl mx-auto">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition p-5 flex items-start justify-between"
            >
              <div>
                <div className="text-xl text-gray-800 font-semibold mb-1">
                  Project Collaboration Request
                </div>
                <div className="mt-2 text-lg text-gray-600">
                  <span className="font-semibold text-blue-700">Project Name: </span>{" "}
                  {r.project?.title || "Project is unavailable at the moment."}
                </div>
                <div className="mt-2 text-lg text-gray-600">
                  <span className="font-semibold text-blue-700">From:</span>{" "}
                  {r.requester?.name || r.requester}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approve(r._id)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(r._id)}
                  className="px-4 py-2 rounded-lg border border-red-400 text-red-600 font-medium hover:bg-red-50 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
