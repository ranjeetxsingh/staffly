/**
 * Example Component: Leave Management
 * Demonstrates best practices for using the API service layer
 */

import React, { useState } from 'react';
import { 
  useMyLeaves, 
  useLeaveBalance, 
  useLeaveApplication 
} from '../Hooks/useLeave';
import { useActiveLeavePolicy } from '../Hooks/usePolicy';

const LeaveManagementExample = () => {
  // ========== Custom Hooks ==========
  const { leaves, loading: leavesLoading, error: leavesError, refetch } = useMyLeaves({
    status: 'all', // or 'pending', 'approved', 'rejected'
  });
  
  const { balance, loading: balanceLoading } = useLeaveBalance();
  const { applyLeave, loading: applying, error: applyError, success } = useLeaveApplication();
  const { policy } = useActiveLeavePolicy();

  // ========== Local State ==========
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const [filter, setFilter] = useState('all');

  // ========== Event Handlers ==========
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await applyLeave(formData);
      
      // Reset form on success
      setFormData({
        leaveType: 'casual',
        fromDate: '',
        toDate: '',
        reason: '',
      });
      
      // Refresh the leave list
      refetch();
      
      // Show success message
      alert('Leave application submitted successfully!');
    } catch (error) {
      // Error is already logged in the hook
      alert('Failed to apply for leave. Please try again.');
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    refetch({ status: newFilter });
  };

  // ========== Render Helpers ==========
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ========== Render Loading State ==========
  if (balanceLoading || leavesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ========== Render Error State ==========
  if (leavesError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {leavesError}</p>
          <button 
            onClick={refetch}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ========== Main Render ==========
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Leave Management</h1>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {balance && Object.entries(balance).map(([type, data]) => (
          <div key={type} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold capitalize mb-2">{type} Leave</h3>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-blue-600">{data.available}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-800">{data.total}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Used: {data.used}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apply Leave Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {policy?.leaveTypes?.map(lt => (
                  <option key={lt.leaveType} value={lt.leaveType}>
                    {lt.leaveType.charAt(0).toUpperCase() + lt.leaveType.slice(1)} 
                    ({lt.annualQuota} days)
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleInputChange}
                min={formData.fromDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide a reason for your leave..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={applying}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {applying ? 'Submitting...' : 'Apply for Leave'}
            </button>

            {/* Error Message */}
            {applyError && (
              <p className="text-red-600 text-sm">{applyError}</p>
            )}

            {/* Success Message */}
            {success && (
              <p className="text-green-600 text-sm">Leave applied successfully!</p>
            )}
          </form>
        </div>

        {/* Leave History */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Leave History</h2>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-3 py-1 text-sm rounded ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Leave List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {leaves && leaves.length > 0 ? (
              leaves.map(leave => (
                <div
                  key={leave._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold capitalize">{leave.leaveType} Leave</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(leave.status)}`}>
                      {leave.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Reason:</strong> {leave.reason}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    Days: {leave.numberOfDays}
                  </p>

                  {leave.rejectionReason && (
                    <p className="text-sm text-red-600 mt-2">
                      <strong>Rejection Reason:</strong> {leave.rejectionReason}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No leave applications found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementExample;
