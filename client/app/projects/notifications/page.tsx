"use client";
// pages/projects/notifications.tsx
import React, { useEffect, useState } from 'react';
import { getNotifications, approveRequest, rejectRequest } from '../../lib/project-api';

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
      alert('Failed to load notifications');
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
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('Approve failed');
    }
  };

  const reject = async (id: string) => {
    try {
      await rejectRequest(id);
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('Reject failed');
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {loading ? <div>Loading...</div> : (
        requests.length === 0 ? <div>No pending requests.</div> : (
          <div className="space-y-4">
            {requests.map(r => (
              <div key={r._id} className="border p-4 rounded bg-white flex items-start justify-between">
                <div>
                  <div className="text-sm text-slate-500">Project</div>
                  <div className="font-medium">{r.project?.title || 'Unknown project'}</div>
                  <div className="mt-2 text-sm text-slate-600">Requester: {r.requester?.name || r.requester}</div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => approve(r._id)} className="px-3 py-1 rounded bg-blue-600 text-white">Approve</button>
                  <button onClick={() => reject(r._id)} className="px-3 py-1 rounded border text-red-600">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
};

export default NotificationsPage;
