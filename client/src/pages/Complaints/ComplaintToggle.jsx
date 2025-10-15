import React, { useState } from "react";
import ComplaintForm from "./ComplaintForm";
import ComplaintStatus from "./ComplaintStatus";

const ComplaintToggle = () => {
  const [showStatus, setShowStatus] = useState(false);

  return (
    <section className="flex flex-col justify-center items-center">
      <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md divide-x border overflow-hidden dark:border-gray-700 dark:divide-gray-700 mb-8">
        <button
          onClick={() => setShowStatus(false)}
          className={`px-6 py-3 text-lg font-semibold transition-all ${
            !showStatus
              ? "bg-indigo-700 text-white"
              : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          📝 Register Complaint
        </button>
        <button
          onClick={() => setShowStatus(true)}
          className={`px-6 py-3 text-lg font-semibold transition-all ${
            showStatus
              ? "bg-indigo-700 text-white"
              : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          📄 View Complaints
        </button>
      </div>

      <div className="w-full max-w-5xl transition-all">
        {showStatus ? <ComplaintStatus /> : <ComplaintForm />}
      </div>
    </section>
  );
};

export default ComplaintToggle;
