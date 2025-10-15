import React from "react";
import { FaPlusCircle, FaEdit, FaShieldAlt, FaBalanceScale, FaClock, FaUserTie, FaRegFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Policies = () => {
  const isHR = false; 

  const policies = [
    {
      id: 1,
      icon: <FaClock size={28} />,
      title: "Attendance & Work Hours Policy",
      description: "Defines office timings, late entry rules, and guidelines for flexible or remote work.",
      effective: "01 March 2025",
    },
    {
      id: 2,
      icon: <FaUserTie size={28} />,
      title: "Leave & Absence Policy",
      description: "Outlines types of leaves (casual, sick, annual) and the approval workflow for HR and managers.",
      effective: "15 February 2025",
    },
    {
      id: 3,
      icon: <FaShieldAlt size={28} />,
      title: "Data Security & Confidentiality Policy",
      description: "Ensures employees maintain data privacy and protect company information from unauthorized access.",
      effective: "10 January 2025",
    },
    {
      id: 4,
      icon: <FaBalanceScale size={28} />,
      title: "Equal Opportunity & Ethics Policy",
      description: "Establishes a fair and transparent environment with zero tolerance for discrimination or bias.",
      effective: "01 January 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-white px-6 py-12">
      {/* Header Section */}
      <section className="text-center max-w-4xl mx-auto mb-12 p-8 rounded-3xl backdrop-blur-md bg-white/40 dark:bg-white/10 shadow-2xl border border-white/20">
        <h1 className="py-2 text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          🧾 Company Policies
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Explore and manage the organizational policies that define work ethics, conduct, attendance, and employee well-being.  
          Our platform allows HR to easily update and expand these policies.
        </p>

        {isHR && (
          <div className="mt-6">
            <Link to="/policies/add">
              <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <FaPlusCircle className="inline-block mr-2 mb-1" />
                Add New Policy
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* Policies Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              {policy.icon}
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">{policy.title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed mb-3">
              {policy.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
              Effective from: {policy.effective}
            </p>

            {isHR && (
              <div className="mt-4 flex justify-center">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-semibold">
                  <FaEdit /> Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Footer Section */}
      <section className="mt-24 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🔄 Dynamic Policy Engine
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          Our HRM system is designed to evolve with your organization.  
          You can add, modify, or automate new policy rules without altering the base code —  
          preparing your company for future AI-driven HR decision-making.
        </p>
      </section>
    </div>
  );
};

export default Policies;
