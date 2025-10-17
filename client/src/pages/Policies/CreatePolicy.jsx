import React, { useState } from "react";
import API from "../../utils/axios";
import { useToast } from "../../Hooks/useToast";

export default function CreatePolicyPage() {
  const { showSuccess, showError } = useToast();

  const [policy, setPolicy] = useState({
    title: "",
    description: "",
    category: "leave",
    isActive: true,
  });

  const [leaveTypes, setLeaveTypes] = useState([
    { leaveType: "", annualQuota: "", carryForward: false, maxCarryForward: 0 },
  ]);

  const [loading, setLoading] = useState(false);

  // 🔹 Handle policy field changes
  const handlePolicyChange = (field, value) => {
    setPolicy((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Handle leave type changes
  const handleLeaveTypeChange = (index, field, value) => {
    const updated = [...leaveTypes];
    updated[index][field] = value;
    setLeaveTypes(updated);
  };

  // 🔹 Add new leave type row
  const addLeaveType = () => {
    setLeaveTypes([
      ...leaveTypes,
      { leaveType: "", annualQuota: "", carryForward: false, maxCarryForward: 0 },
    ]);
  };

  // 🔹 Remove leave type row
  const removeLeaveType = (index) => {
    const updated = leaveTypes.filter((_, i) => i !== index);
    setLeaveTypes(updated);
  };

  // 🔹 Validate before submit
  const validate = () => {
    if (!policy.title.trim() || !policy.description.trim()) {
      showError("Title and description are required");
      return false;
    }

    for (const lt of leaveTypes) {
      if (!lt.leaveType.trim()) {
        showError("Leave type name is required for all entries");
        return false;
      }
      if (lt.annualQuota === "" || lt.annualQuota == null) {
        showError(`Please set annual quota for ${lt.leaveType || "a leave type"}`);
        return false;
      }
    }

    return true;
  };

  // 🔹 Submit new policy
  const handleCreatePolicy = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        ...policy,
        leaveTypes: leaveTypes.map((lt) => ({
          leaveType: lt.leaveType,
          annualQuota: Number(lt.annualQuota),
          carryForward: Boolean(lt.carryForward),
          maxCarryForward: lt.carryForward
            ? Number(lt.maxCarryForward) || 0
            : 0,
        })),
      };

      const res = await API.post("/api/policies", payload);

      if (res.success) {
        showSuccess("✅ Policy created successfully!");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showError(res.data.message || "Failed to create policy");
      }
    } catch (err) {
      console.error("Error creating policy:", err);
      showError("Failed to create policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">
        Create New Leave Policy
      </h1>

      {/* Policy Info Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input
            type="text"
            value={policy.title}
            onChange={(e) => handlePolicyChange("title", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Leave Policy 2025"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Description
          </label>
          <textarea
            value={policy.description}
            onChange={(e) => handlePolicyChange("description", e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Short description of the policy"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={policy.isActive}
              onChange={(e) => handlePolicyChange("isActive", e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700">Active Policy</label>
          </div>

          <p className="text-sm text-gray-500 mt-2 sm:mt-0">
            Category: <span className="font-medium">{policy.category}</span>
          </p>
        </div>
      </div>

      {/* Leave Types Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Leave Types</h2>

        <div className="space-y-6">
          {leaveTypes.map((lt, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 border border-gray-200 p-4 rounded-xl"
            >
              {/* Leave Type */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Leave Type
                </label>
                <input
                  type="text"
                  value={lt.leaveType}
                  onChange={(e) =>
                    handleLeaveTypeChange(index, "leaveType", e.target.value)
                  }
                  placeholder="e.g., casual"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Annual Quota */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Annual Quota
                </label>
                <input
                  type="number"
                  value={lt.annualQuota}
                  onChange={(e) =>
                    handleLeaveTypeChange(index, "annualQuota", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Carry Forward */}
              <div className="flex flex-col justify-center">
                <label className="text-sm text-gray-600 mb-1">
                  Carry Forward
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lt.carryForward}
                    onChange={(e) =>
                      handleLeaveTypeChange(
                        index,
                        "carryForward",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              {/* Max Carry Forward */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max Carry Forward
                </label>
                <input
                  type="number"
                  value={lt.maxCarryForward}
                  onChange={(e) =>
                    handleLeaveTypeChange(
                      index,
                      "maxCarryForward",
                      e.target.value
                    )
                  }
                  disabled={!lt.carryForward}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    lt.carryForward
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Remove Button */}
              <div className="flex items-center justify-center">
                {leaveTypes.length > 1 && (
                  <button
                    onClick={() => removeLeaveType(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addLeaveType}
          className="mt-5 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
        >
          + Add Leave Type
        </button>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleCreatePolicy}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create Policy"}
          </button>
        </div>
      </div>
    </div>
  );
}
