/**
 * Example Component: Attendance Management
 * Demonstrates best practices for using the attendance API service layer
 */

import React, { useState, useEffect } from 'react';
import { 
  useAttendance, 
  useAttendanceRecords,
  useTodaySummary 
} from '../Hooks/useAttendance';

const AttendanceManagementExample = () => {
  // ========== Custom Hooks ==========
  const { checkIn, checkOut, todayAttendance, loading: actionLoading, error: actionError } = useAttendance();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { 
    records, 
    stats, 
    loading: recordsLoading, 
    error: recordsError,
    refetch 
  } = useAttendanceRecords({
    month: selectedMonth,
    year: selectedYear
  });

  // For HR/Admin - Today's Summary
  const { summary, loading: summaryLoading } = useTodaySummary();

  // ========== Local State ==========
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // ========== Effects ==========
  useEffect(() => {
    // Check if user is already checked in today
    if (todayAttendance && todayAttendance.checkInTime && !todayAttendance.checkOutTime) {
      setIsCheckedIn(true);
    } else {
      setIsCheckedIn(false);
    }
  }, [todayAttendance]);

  // ========== Event Handlers ==========
  const handleCheckIn = async () => {
    try {
      await checkIn();
      setIsCheckedIn(true);
      refetch(); // Refresh attendance records
      alert('Checked in successfully!');
    } catch (error) {
      alert('Failed to check in. Please try again.');
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      setIsCheckedIn(false);
      refetch(); // Refresh attendance records
      alert('Checked out successfully!');
    } catch (error) {
      alert('Failed to check out. Please try again.');
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // ========== Render Helpers ==========
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half-day': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Generate month options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Generate year options (current year and 2 previous years)
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  // ========== Main Render ==========
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>

      {/* Check In/Out Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Today's Attendance</h2>
            <p className="text-blue-100">{formatDate(new Date())}</p>
            <p className="text-3xl font-bold mt-2">{getCurrentTime()}</p>
          </div>
          
          <div className="text-center">
            {todayAttendance && (
              <div className="mb-4">
                <p className="text-sm text-blue-100">Check In</p>
                <p className="text-2xl font-bold">{formatTime(todayAttendance.checkInTime)}</p>
                {todayAttendance.checkOutTime && (
                  <>
                    <p className="text-sm text-blue-100 mt-2">Check Out</p>
                    <p className="text-2xl font-bold">{formatTime(todayAttendance.checkOutTime)}</p>
                  </>
                )}
              </div>
            )}
            
            <button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              disabled={actionLoading}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
                isCheckedIn
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {actionLoading ? 'Processing...' : isCheckedIn ? 'Check Out' : 'Check In'}
            </button>
            
            {actionError && (
              <p className="text-red-200 text-sm mt-2">{actionError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Days</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalDays || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Present</p>
            <p className="text-3xl font-bold text-green-600">{stats.present || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-600">{stats.absent || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.attendanceRate ? `${stats.attendanceRate.toFixed(1)}%` : '0%'}
            </p>
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Attendance Records</h2>
          
          {/* Month/Year Filter */}
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {recordsLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading attendance records...</p>
          </div>
        )}

        {/* Error State */}
        {recordsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {recordsError}</p>
          </div>
        )}

        {/* Records Table */}
        {!recordsLoading && !recordsError && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records && records.length > 0 ? (
                  records.map(record => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.checkInTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.checkOutTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.totalWorkHours ? `${record.totalWorkHours.toFixed(2)} hrs` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No attendance records found for this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* HR/Admin Section - Today's Summary */}
      {summary && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Summary (Admin View)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800">{summary.total || 0}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{summary.present || 0}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{summary.absent || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagementExample;
