import React from "react";
import ComplaintMainSection from "./ComplaintMainSection";
import ComplaintToggle from "./ComplaintToggle";

const ComplaintsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white px-6 py-10">
      <ComplaintMainSection />
      <ComplaintToggle />
    </div>
  );
};

export default ComplaintsPage;
