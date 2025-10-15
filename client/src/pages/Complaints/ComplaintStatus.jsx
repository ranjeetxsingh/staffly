import React, { useEffect, useState } from "react";
import { complaintService } from "../../services/complaintService";

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintService.getComplaintByUser();
        setComplaints(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) {
    return <p className="text-center">Loading complaints...</p>;
  }

  if (complaints.length === 0) {
    return <p className="text-center text-gray-500">No complaints found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {complaints.map((complaint) => (
        <div key={complaint._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-2">{complaint.issue}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2"><span className="font-semibold">Location:</span> {complaint.location}</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm"><span className="font-semibold">Status:</span> {complaint.status || "Pending"}</p>
        </div>
      ))}
    </div>
  );
};

export default ComplaintStatus;
