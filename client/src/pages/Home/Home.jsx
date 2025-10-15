import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserClock,
  FaCalendarCheck,
  FaChartLine,
  FaUsersCog,
  FaLaptopCode,
  FaRobot,
} from "react-icons/fa";

const Home = () => {
  const isHR = false; // replace based on auth logic

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-white px-6 py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-5xl mx-auto mt-10 p-8 rounded-3xl backdrop-blur-md bg-white/40 dark:bg-white/10 shadow-2xl border border-white/20">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent py-2">
          👩‍💼 HR Management Portal
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
          Capture attendance, manage leaves, analyze productivity, and design data-driven HR policies — 
          all through a futuristic, AI-ready platform.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          {isHR ? (
            <>
              <Link to="/dashboard">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  📊 HR Dashboard
                </button>
              </Link>
              <Link to="/attendance">
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  ⏱ Attendance Logs
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/attendance">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  🕒 My Attendance
                </button>
              </Link>
              <Link to="/leaves">
                <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  🌴 Apply for Leave
                </button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Key Features */}
      <section className="mt-20 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ✨ Core Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard
            icon={<FaUserClock size={30} />}
            title="Smart Attendance Tracking"
            description="Record real-time attendance through access-controlled entry systems connected to the cloud."
          />
          <FeatureCard
            icon={<FaCalendarCheck size={30} />}
            title="Leave Management"
            description="Seamlessly manage employee leave requests, approvals, and balances through a unified dashboard."
          />
          <FeatureCard
            icon={<FaChartLine size={30} />}
            title="Work Duration Analytics"
            description="Identify work patterns, peak productivity hours, and optimize office schedules."
          />
          <FeatureCard
            icon={<FaUsersCog size={30} />}
            title="HR Insights Dashboard"
            description="Get comprehensive insights into employee engagement, attendance, and departmental health."
          />
          <FeatureCard
            icon={<FaLaptopCode size={30} />}
            title="Policy Engine"
            description="Add, modify, or remove HR policies dynamically — no code changes required."
          />
          <FeatureCard
            icon={<FaRobot size={30} />}
            title="AI-Ready Framework"
            description="Future-proof design enabling AI-based policy suggestions, analytics, and automation."
          />
        </div>
      </section>

      {/* About Section */}
      <section className="mt-24 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🚀 Why Choose Our HRM Platform?
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Move beyond manual HR processes — unlock the power of data, automation, and analytics.
          Build policies backed by real-time behavioral insights and future-proof your organization’s workforce management.
        </p>
      </section>

      {/* CTA Section */}
      <section className="mt-20 text-center">
        <h2 className="text-3xl font-semibold mb-3">🎯 Ready to Revolutionize HR?</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Start managing attendance, leaves, and analytics seamlessly.
        </p>
        <Link to="/dashboard">
          <button className="relative overflow-hidden px-8 py-4 text-white text-xl font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl hover:scale-105 transition-all duration-300">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 opacity-0 hover:opacity-30 transition-opacity"></span>
            🚀 Launch Dashboard
          </button>
        </Link>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center">
    <div className="flex justify-center mb-4 text-indigo-600 dark:text-indigo-400">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
      {description}
    </p>
  </div>
);

export default Home;
