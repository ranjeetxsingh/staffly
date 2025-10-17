import React, { useEffect, useState } from "react";
import API from "../../utils/axios";
import { useToast } from "../../Hooks/useToast";

export default function LeavePolicyManagementPage() {
  const [policy, setPolicy] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchActivePolicy();
  }, []);

  // 🔹 Fetch Active Policy
  const fetchActivePolicy = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/policies/leave/active");

      if (res.success) {
        setPolicy(res.data);
        setLeaveTypes(res.data.leaveTypes || []);
      } else {
        showError(res.data?.message || "No active leave policy found");
      }
    } catch (err) {
      console.error("Error fetching leave policy:", err);
      showError("Failed to load leave policy");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Field Change
  const handleLeaveTypeChange = (index, field, value) => {
    const updated = [...leaveTypes];
    updated[index][field] = value;
    setLeaveTypes(updated);
  };

  // 🔹 Validate before submitting
  const validatePolicyData = () => {
    if (!policy?._id) {
      showError("No active policy selected");
      return false;
    }

    if (!Array.isArray(leaveTypes) || leaveTypes.length === 0) {
      showError("No leave types to update");
      return false;
    }

    for (const lt of leaveTypes) {
      if (!lt.leaveType || lt.annualQuota === "" || lt.annualQuota == null) {
        showError("Each leave type must have a valid name and annual quota");
        return false;
      }
    }

    return true;
  };

  // 🔹 Submit updated leave types
  const handleUpdatePolicy = async () => {
    if (!validatePolicyData()) return;

    try {
      setUpdating(true);
      let successCount = 0;

      for (const lt of leaveTypes) {
        const payload = {
          leaveType: lt.leaveType,
          annualQuota: Number(lt.annualQuota),
          carryForward: Boolean(lt.carryForward),
          maxCarryForward: Number(lt.maxCarryForward) || 0,
          description: lt.description || "",
        };

        try {
          const res = await API.put(
            `/api/policies/${policy._id}/leave-type`,
            payload
          );

          if (res.success) {
            showSuccess(`${lt.leaveType} leave updated successfully!`);
            successCount++;
          } else {
            showError(`Failed to update ${lt.leaveType} leave`);
          }
        } catch (err) {
          console.error(err);
          showError(`Error updating ${lt.leaveType} leave`);
        }
      }

      if (successCount === leaveTypes.length) {
        showSuccess("✅ All leave types updated successfully!");
      } else if (successCount > 0) {
        showSuccess(`${successCount}/${leaveTypes.length} leave types updated successfully`);
      }

      // ✅ Refresh data and reload page
      await fetchActivePolicy();
      
    } catch (err) {
      console.error(err);
      showError("Failed to update leave types");
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 UI States
  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  if (!policy)
    return (
      <p className="text-center mt-10 text-gray-600">
        No active policy found.
      </p>
    );

  // 🔹 Main Render
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold mb-4 text-gray-800">
        Leave Policy Management
      </h1>

      {/* Policy Info */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-medium text-gray-800">{policy.title}</h2>
        <p className="text-gray-600 mt-2">{policy.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          Effective From:{" "}
          <span className="font-medium">
            {new Date(policy.effectiveFrom).toLocaleDateString()}
          </span>
        </p>
      </div>

      {/* Leave Types Table */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-medium mb-4 text-gray-800">Leave Types</h2>

        <div className="space-y-6">
          {leaveTypes.map((lt, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 border border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow"
            >
              {/* Leave Type */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Leave Type
                </label>
                <input
                  type="text"
                  value={lt.leaveType}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800"
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
                    handleLeaveTypeChange(index, "annualQuota", Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Carry Forward */}
              <div className="flex flex-col justify-center space-y-2">
                <label className="text-sm text-gray-600">Carry Forward</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lt.carryForward}
                    onChange={(e) =>
                      handleLeaveTypeChange(index, "carryForward", e.target.checked)
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
                    handleLeaveTypeChange(index, "maxCarryForward", Number(e.target.value))
                  }
                  disabled={!lt.carryForward}
                  className={`w-full border rounded-lg px-3 py-2 text-gray-800 ${
                    lt.carryForward
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  value={lt.description}
                  onChange={(e) =>
                    handleLeaveTypeChange(index, "description", e.target.value)
                  }
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleUpdatePolicy}
            disabled={updating}
            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${
              updating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
