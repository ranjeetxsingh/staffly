import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Button,
  Table,
  Modal,
  Badge,
  Skeleton,
  Select,
  Input,
} from '../../components/UI';
import { useAttendance, useAttendanceRecords, useTodaySummary } from '../../Hooks/useAttendance';
import { useToast } from '../../Hooks/useToast';

const AttendancePage = () => {
  const { user } = useSelector((state) => state.auth);
  const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';
  const isEmployee = !isHROrAdmin;
  
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('');
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });

  // Use appropriate hooks based on user role
  const { checkIn, checkOut, loading: actionLoading } = useAttendance();
  
  // For regular employees - fetch their own attendance
  const { 
    records: myRecords, 
    stats: apiStats,
    loading: myRecordsLoading,
    refetch: refetchMyRecords 
  } = useAttendanceRecords({ autoFetch: !isHROrAdmin });
  
  // For HR/Admin - fetch today's summary
  const { 
    summary: todaySummary, 
    loading: summaryLoading,
    refetch: refetchSummary 
  } = useTodaySummary();
  
  const { showSuccess, showError } = useToast();

  // Determine which data to use
  // Backend returns { success: true, data: { records: [...], stats: {...} } }
  // After axios interceptor: { success: true, data: { records: [...] } }
  const attendanceData = isHROrAdmin 
    ? (todaySummary?.data?.records || todaySummary?.records || [])
    : (myRecords || []);
    
  const attendance = Array.isArray(attendanceData) ? attendanceData : [];
  const loading = isHROrAdmin ? summaryLoading : myRecordsLoading;

  useEffect(() => {
    // Load attendance when component mounts or filter changes
    // Hooks already auto-fetch, but we can manually refetch if needed
    if (isHROrAdmin) {
      refetchSummary();
    } else {
      refetchMyRecords();
    }
  }, [filterDate]);

  useEffect(() => {
    if (attendance) {
      console.log('📊 Attendance Data:', {
        isHROrAdmin,
        attendanceLength: attendance.length,
        firstRecord: attendance[0],
        apiStats,
        todaySummary
      });
      calculateStats();
    }
  }, [attendance]);

  const calculateStats = () => {
    // If we have stats from the API (for employees), use them
    if (myRecords && !isHROrAdmin) {
      // Stats are already available from useAttendanceRecords hook
      // But we can also calculate from records
      const present = attendance?.filter(a => a.status === 'present')?.length || 0;
      const absent = attendance?.filter(a => a.status === 'absent')?.length || 0;
      const late = attendance?.filter(a => a.status === 'late')?.length || 0;
      const halfDay = attendance?.filter(a => a.status === 'half-day')?.length || 0;
      
      setStats({
        present,
        absent,
        late: late + halfDay,
        total: attendance?.length || 0,
      });
    } else {
      // For HR viewing all employees
      const present = attendance?.filter(a => a.status === 'present')?.length || 0;
      const absent = attendance?.filter(a => a.status === 'absent')?.length || 0;
      const late = attendance?.filter(a => a.status === 'late')?.length || 0;
      const halfDay = attendance?.filter(a => a.status === 'half-day')?.length || 0;
      
      setStats({
        present,
        absent,
        late: late + halfDay,
        total: attendance?.length || 0,
      });
    }
  };

  const handleCheckIn = async () => {
    try {
      await checkIn();
      showSuccess('Checked in successfully!');
      setIsCheckInModalOpen(false);
      // Refetch attendance based on user role
      if (isHROrAdmin) {
        refetchSummary();
      } else {
        refetchMyRecords();
      }
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      showSuccess('Checked out successfully!');
      // Refetch attendance based on user role
      if (isHROrAdmin) {
        refetchSummary();
      } else {
        refetchMyRecords();
      }
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to check out');
    }
  };

  const filteredAttendance = attendance?.filter((record) => {
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesStatus;
  }) || [];

  const tableColumns = isHROrAdmin ? [
    {
      key: 'employee',
      label: 'Employee',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.employee?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {row.employee?.email || ''}
          </p>
          {row.employee?.employeeId && (
            <p className="text-xs text-gray-400">
              ID: {row.employee.employeeId}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'sessions',
      label: 'Check In',
      render: (value, row) => {
        const lastSession = row.sessions?.[row.sessions.length - 1];
        return lastSession?.checkIn 
          ? new Date(lastSession.checkIn).toLocaleTimeString() 
          : '-';
      },
    },
    {
      key: 'sessions',
      label: 'Check Out',
      render: (value, row) => {
        const lastSession = row.sessions?.[row.sessions.length - 1];
        return lastSession?.checkOut 
          ? new Date(lastSession.checkOut).toLocaleTimeString() 
          : lastSession?.checkIn ? 'Still Checked In' : '-';
      },
    },
    {
      key: 'totalWorkHoursDecimal',
      label: 'Hours',
      render: (value, row) => {
        return value && parseFloat(value) > 0 
          ? `${parseFloat(value).toFixed(2)}h` 
          : row.sessions?.some(s => !s.checkOut) 
          ? 'In Progress' 
          : '0.00h';
      },
    },
    {
      key: 'sessions',
      label: 'Sessions',
      render: (value, row) => (
        <Badge variant="info" size="sm">
          {row.sessions?.length || 0}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          variant={
            value === 'present' ? 'success' :
            value === 'late' ? 'warning' :
            value === 'absent' ? 'danger' :
            value === 'work-from-home' ? 'info' :
            value === 'half-day' ? 'warning' :
            'default'
          }
        >
          {value?.replace('-', ' ').toUpperCase() || 'N/A'}
        </Badge>
      ),
    },
  ] : [
    // Employee view - no employee column
    {
      key: 'date',
      label: 'Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'sessions',
      label: 'Check In',
      render: (value, row) => {
        const lastSession = row.sessions?.[row.sessions.length - 1];
        return lastSession?.checkIn 
          ? new Date(lastSession.checkIn).toLocaleTimeString() 
          : '-';
      },
    },
    {
      key: 'sessions',
      label: 'Check Out',
      render: (value, row) => {
        const lastSession = row.sessions?.[row.sessions.length - 1];
        return lastSession?.checkOut 
          ? new Date(lastSession.checkOut).toLocaleTimeString() 
          : lastSession?.checkIn ? 'Still Checked In' : '-';
      },
    },
    {
      key: 'totalWorkHoursDecimal',
      label: 'Hours',
      render: (value, row) => {
        return value && parseFloat(value) > 0 
          ? `${parseFloat(value).toFixed(2)}h` 
          : row.sessions?.some(s => !s.checkOut) 
          ? 'In Progress' 
          : '0.00h';
      },
    },
    {
      key: 'sessions',
      label: 'Sessions',
      render: (value, row) => (
        <Badge variant="info" size="sm">
          {row.sessions?.length || 0}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          variant={
            value === 'present' ? 'success' :
            value === 'late' ? 'warning' :
            value === 'absent' ? 'danger' :
            value === 'work-from-home' ? 'info' :
            value === 'half-day' ? 'warning' :
            'default'
          }
        >
          {value?.replace('-', ' ').toUpperCase() || 'N/A'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEmployee ? 'My Attendance' : 'Attendance Management'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEmployee 
            ? 'Track your attendance and working hours' 
            : 'View and manage employee attendance records'
          }
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card variant="elevated">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Days</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.total}
            </h3>
            {apiStats && (
              <p className="text-xs text-gray-500 mt-1">
                {apiStats.totalDays} recorded
              </p>
            )}
          </div>
        </Card>
        <Card variant="elevated">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
            <h3 className="text-3xl font-bold text-success-600 dark:text-success-400 mt-2">
              {stats.present}
            </h3>
            {apiStats && (
              <p className="text-xs text-gray-500 mt-1">
                {((stats.present / stats.total) * 100 || 0).toFixed(0)}% attendance
              </p>
            )}
          </div>
        </Card>
        <Card variant="elevated">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Late/Half Day</p>
            <h3 className="text-3xl font-bold text-warning-600 dark:text-warning-400 mt-2">
              {stats.late}
            </h3>
            {apiStats?.halfDays && (
              <p className="text-xs text-gray-500 mt-1">
                {apiStats.halfDays} half days
              </p>
            )}
          </div>
        </Card>
        <Card variant="elevated">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {apiStats ? 'Total Hours' : 'Absent'}
            </p>
            <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
              {apiStats ? `${apiStats.totalWorkHours}h` : stats.absent}
            </h3>
            {apiStats && (
              <p className="text-xs text-gray-500 mt-1">
                Avg: {apiStats.averageWorkHours}h/day
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 w-full">
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="md:w-64"
            />
            <Select
              placeholder="Filter by status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'present', label: 'Present' },
                { value: 'absent', label: 'Absent' },
                { value: 'late', label: 'Late' },
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              className="md:w-64"
            />
          </div>
          {/* Only show check-in/out buttons for employees */}
          {isEmployee && (
            <div className="flex gap-2">
              <Button
                variant="success"
                onClick={() => setIsCheckInModalOpen(true)}
              >
                ✓ Check In
              </Button>
              <Button
                variant="warning"
                onClick={handleCheckOut}
              >
                ← Check Out
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Attendance Records */}
      {loading ? (
        <Card>
          <Skeleton variant="text" count={5} />
        </Card>
      ) : (
        <Card>
          <Table
            columns={tableColumns}
            data={filteredAttendance}
            striped
            hoverable
            emptyMessage="No attendance records found"
          />
        </Card>
      )}

      {/* Check In Modal */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Check In"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCheckInModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleCheckIn}>
              Confirm Check In
            </Button>
          </>
        }
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Check In?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Current time: {new Date().toLocaleTimeString()}
          </p>
          <div className="bg-gray-100 dark:bg-dark-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your check-in will be recorded with the current timestamp.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendancePage;
