import React from "react";
import { Link } from "react-router-dom";
import { FaMoneyCheckAlt, FaCalendarAlt, FaFileInvoiceDollar, FaReceipt } from "react-icons/fa";
import { useSelector } from "react-redux";

const Bills = () => {
  const user = useSelector(state => state.auth.user);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white px-6 py-10">
        
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            🧾 Billing & Payments
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            View your bills, track payment history, and stay updated with your dues — all in one place.
          </p>

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link to="/payments">
              <button className="px-5 py-3 bg-green-700 text-white rounded-lg shadow hover:bg-green-900 transition font-semibold cursor-pointer">
                💳 View Payment History
              </button>
            </Link>
            <Link to="/home">
              <button className="px-5 py-3 bg-indigo-700 text-white rounded-lg shadow hover:bg-indigo-900 transition font-semibold cursor-pointer">
                📊 Back to Homepage
              </button>
            </Link>
          </div>
        </section>

        {/* Current Bill Section */}
        <section className="mt-16 max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6">📋 Current Bill Details</h2>
          <div className="space-y-4">
            <BillItem label="Tenant Name" value={user.name} />
            <BillItem label="Room Number" value="A-203" />
            <BillItem label="Billing Month" value="April 2025" />
            <BillItem label="Total Rent" value="₹ 8,500" />
            <BillItem label="Maintenance Charges" value="₹ 500" />
            <BillItem label="Due Date" value="May 5, 2025" />
            <BillItem label="Payment Status" value="Pending" />
          </div>

          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xl shadow cursor-pointer">
              💳 Pay Now
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">✨ Billing Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<FaFileInvoiceDollar size={28} />} title="Monthly Invoices" description="Get detailed monthly invoices for rent, maintenance, and utilities." />
            <FeatureCard icon={<FaCalendarAlt size={28} />} title="Due Date Reminders" description="Stay informed with reminders before your bill due dates." />
            <FeatureCard icon={<FaReceipt size={28} />} title="Payment Receipts" description="Receive digital receipts instantly after completing your payments." />
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">🚀 Stay On Top of Your Bills!</h2>
          <p className="text-lg text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Manage your rental payments easily, avoid penalties, and maintain a smooth living experience.  
            Your financial management, simplified.
          </p>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            🎯 Ready to Pay?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Check your current bills and pay securely online!
          </p>
          <Link to="/payments">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xl shadow cursor-pointer">
              🧾 View All Payments
            </button>
          </Link>
        </section>

      </div>

      <div className="w-full">
        {/* Footer (optional) */}
      </div>
    </>
  );
};

const BillItem = ({ label, value }) => (
  <div className="flex justify-between items-center border-b pb-2 text-gray-700 dark:text-gray-300">
    <span className="font-semibold">{label}</span>
    <span>{value}</span>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700 hover:scale-105 cursor-pointer">
    <div className="flex items-center justify-center mb-3 text-green-600 dark:text-green-400">
      {icon}
    </div>
    <h3 className="text-xl text-center font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-700 text-center dark:text-gray-300">{description}</p>
  </div>
);

export default Bills;
