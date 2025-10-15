import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaHistory, FaMoneyBill, FaUsers } from "react-icons/fa";
import { MdPersonOff, MdReceipt } from "react-icons/md";

const RentDashboard = () => {
  const [tenants, setTenants] = useState([
    { id: 1, name: "John Doe", status: "active", payments: [500, 500, 600] },
    { id: 2, name: "Jane Smith", status: "active", payments: [700, 700] },
  ]);
  const [pastTenants, setPastTenants] = useState([
    { id: 3, name: "Mike Ross", leftDate: "2023-12-20" },
  ]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const handleGenerateBill = (tenant) => {
    alert(`Bill generated for ${tenant.name}`);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <motion.h1
        className="text-3xl font-bold mb-6 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaUsers className="text-blue-500" /> Rent Mate Dashboard
      </motion.h1>

      {/* Add Tenant & Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <ActionButton icon={<FaUserPlus />} label="Add Tenant" onClick={() => alert("Open add tenant modal")} />
        <ActionButton icon={<FaHistory />} label="View History" onClick={() => alert("View overall history")} />
      </div>

      {/* Active Tenants Section */}
      <Section title="Current Tenants" icon={<FaUsers />}>
        <div className="grid md:grid-cols-2 gap-4">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{tenant.name}</h2>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleGenerateBill(tenant)}
                >
                  <MdReceipt className="inline mr-1" />
                  Generate Bill
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Payment History:</p>
                <ul className="text-sm">
                  {tenant.payments.map((amt, i) => (
                    <li key={i}>💰 ₹{amt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Past Tenants */}
      <Section title="Past Tenants" icon={<MdPersonOff />}>
        <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
          {pastTenants.map((pt) => (
            <li key={pt.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <strong>{pt.name}</strong> (Left on {pt.leftDate})
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <span className="text-blue-500">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const ActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
  >
    <span className="text-blue-500">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

export default RentDashboard;
