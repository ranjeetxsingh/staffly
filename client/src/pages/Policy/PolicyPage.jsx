import { useEffect, useState } from "react";
import API from "../../utils/axios";
import PageHeader from "../../components/PageHeader/PageHeader";

export default function PolicyPage() {
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({ title: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  const fetchPolicies = async () => {
    const res = await API.get("/policies");
    setPolicies(res.data);
  };

  const addPolicy = async () => {
    await API.post("/policies/add", newPolicy);
    setNewPolicy({ title: "", description: "" });
    setShowForm(false);
    fetchPolicies();
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div className="p-6">
      <PageHeader title="Company Policies" action="Add Policy" onAction={() => setShowForm(true)} />

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-3">Add New Policy</h2>
          <input
            type="text"
            placeholder="Policy Title"
            value={newPolicy.title}
            onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
            className="p-2 border rounded-lg w-full mb-3"
          />
          <textarea
            placeholder="Policy Description"
            value={newPolicy.description}
            onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
            className="p-2 border rounded-lg w-full mb-3"
            rows="4"
          />
          <button
            onClick={addPolicy}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Policy
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <div
            key={policy._id}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition hover:scale-[1.02]"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
              {policy.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{policy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
