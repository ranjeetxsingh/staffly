import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, Badge, Skeleton } from '../../components/UI';
import { useEmployees, useEmployeeStats } from '../../Hooks/useEmployee';
import { useTodaySummary } from '../../Hooks/useAttendance';
import { usePendingLeaves, useAllLeaves } from '../../Hooks/useLeave';
import { useToast } from '../../Hooks/useToast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';
  const isEmployee = !isHROrAdmin;
  
  // Redirect employees to home or attendance page
  useEffect(() => {
    if (isEmployee) {
      navigate('/attendance');
    }
  }, [isEmployee, navigate]);
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absent: 0,
    onLeave: 0,
    checkedIn: 0,
    checkedOut: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  // Use hooks with autoFetch disabled initially
  const { employees, loading: employeesLoading, refetch: fetchEmployees } = useEmployees({ autoFetch: false });
  const { stats: employeeStats, loading: statsLoading, refetch: fetchStats } = useEmployeeStats();
  const { summary: todaySummary, loading: summaryLoading, refetch: fetchTodaySummary } = useTodaySummary();
  const { leaves: pendingLeavesList, loading: leavesLoading, refetch: fetchPendingLeaves } = usePendingLeaves({ autoFetch: false });
  const { leaves: allLeavesList, loading: allLeavesLoading, refetch: fetchAllLeaves } = useAllLeaves({ autoFetch: false });
  const { showError } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Build promises array - only fetch pending leaves if user is HR/Admin
      const promises = [
        fetchEmployees().catch((err) => {
          console.error('Error fetching employees:', err);
          return { employees: [] };
        }),
        fetchTodaySummary().catch((err) => {
          console.error('Error fetching attendance summary:', err);
          return null;
        }),
      ];

      // Only fetch pending leaves for HR/Admin users
      if (isHROrAdmin) {
        promises.push(
          fetchPendingLeaves().catch((err) => {
            console.error('Error fetching pending leaves:', err);
            return { leaves: [] };
          }),
          fetchAllLeaves().catch((err) => {
            console.error('Error fetching all leaves:', err);
            return { leaves: [] };
          })
        );
      }

      // Fetch all required data
      const results = await Promise.all(promises);
      const [employeesData, summaryData, leavesData, allLeavesData] = results;

      console.log('📊 Dashboard Data:', {
        employeesData,
        summaryData,
        leavesData,
        allLeavesData,
        isHROrAdmin
      });

      // Extract data properly
      const employeesList = employeesData?.employees || [];
      
      // Summary data is nested: { success: true, data: { totalEmployees, present, absent, ... } }
      const summary = summaryData?.data || summaryData || {};
      console.log('📈 Extracted Summary:', summary);
      
      const leavesList = isHROrAdmin ? (leavesData?.leaves || []) : [];
      const allLeaves = isHROrAdmin ? (allLeavesData?.leaves || []) : [];

      // Calculate leave statistics from all leaves
      const approvedLeavesCount = allLeaves.filter(l => l.status === 'approved').length;
      const rejectedLeavesCount = allLeaves.filter(l => l.status === 'rejected').length;
      const pendingLeavesCount = leavesList.length;

      // Use data from today's summary
      const totalEmps = summary?.totalEmployees || employeesList?.length || 0;
      const present = summary?.present || 0;
      const absent = summary?.absent || 0;
      const onLeaveCount = summary?.onLeave || 0;
      const checkedIn = summary?.checkedIn || 0;
      const checkedOut = summary?.checkedOut || 0;
      
      // Calculate attendance rate
      const rate = totalEmps > 0 ? ((present / totalEmps) * 100).toFixed(1) : 0;

      setStats({
        totalEmployees: totalEmps,
        presentToday: present,
        absent: absent,
        onLeave: onLeaveCount,
        checkedIn: checkedIn,
        checkedOut: checkedOut,
        pendingLeaves: pendingLeavesCount,
        approvedLeaves: approvedLeavesCount,
        rejectedLeaves: rejectedLeavesCount,
        attendanceRate: rate,
      });

      // Generate recent activities from actual data
      const activities = [];
      
      // Add recent check-ins from attendance records
      if (summary?.records && Array.isArray(summary.records)) {
        summary.records
          .filter(r => r.employee && r.sessions && r.sessions.length > 0) // Only records with employee data and sessions
          .slice(0, 3)
          .forEach((record, index) => {
            const lastSession = record.sessions[record.sessions.length - 1];
            if (lastSession?.checkIn) {
              const checkInTime = new Date(lastSession.checkIn);
              const timeStr = checkInTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              activities.push({
                id: `checkin-${record._id || index}`,
                type: 'attendance',
                message: `${record.employee.name} checked in`,
                time: timeStr,
                icon: '✓'
              });
            }
          });
      }
      
      // Add pending leave requests
      if (leavesList && leavesList.length > 0) {
        leavesList.slice(0, 3).forEach((leave, index) => {
          const createdTime = new Date(leave.createdAt);
          const timeStr = createdTime.toLocaleString([], { 
            month: 'short',
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
          });
          activities.push({
            id: `leave-${leave._id || index}`,
            type: 'leave',
            message: `${leave.employee?.name || 'Employee'} applied for ${leave.leaveType} leave`,
            time: timeStr,
            icon: '📝'
          });
        });
      }
      
      // Add check-outs from attendance records
      if (summary?.records && Array.isArray(summary.records)) {
        summary.records
          .filter(r => r.employee && r.sessions && r.sessions.length > 0)
          .slice(0, 2)
          .forEach((record, index) => {
            const lastSession = record.sessions[record.sessions.length - 1];
            if (lastSession?.checkOut) {
              const checkOutTime = new Date(lastSession.checkOut);
              const timeStr = checkOutTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              activities.push({
                id: `checkout-${record._id || index}`,
                type: 'attendance',
                message: `${record.employee.name} checked out`,
                time: timeStr,
                icon: '←'
              });
            }
          });
      }
      
      // Limit to 6 most recent activities
      const recentActivitiesList = activities.slice(0, 6);
      
      // Add default if no activities
      if (recentActivitiesList.length === 0) {
        recentActivitiesList.push(
          { id: 1, type: 'info', message: 'No recent activity', time: 'Today', icon: 'ℹ️' }
        );
      }

      setRecentActivities(recentActivitiesList);

    } catch (error) {
      showError('Failed to load dashboard data');
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Statistics Card Component
  const StatCard = ({ title, value, subtitle, icon, variant = 'default', trend }) => (
    <Card variant="elevated" hoverable className="transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {loading ? (
            <Skeleton variant="title" width="60%" className="mt-2" />
          ) : (
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          variant === 'primary' ? 'bg-primary-100 dark:bg-primary-900/20' :
          variant === 'success' ? 'bg-success-100 dark:bg-success-900/20' :
          variant === 'warning' ? 'bg-warning-100 dark:bg-warning-900/20' :
          variant === 'danger' ? 'bg-danger-100 dark:bg-danger-900/20' :
          'bg-gray-100 dark:bg-dark-700'
        }`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <Badge variant={trend > 0 ? 'success' : 'danger'} size="sm">
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={loading ? '...' : stats.totalEmployees}
          subtitle="Active workforce"
          icon="👥"
          variant="primary"
        />
        <StatCard
          title="Present Today"
          value={loading ? '...' : stats.presentToday}
          subtitle={`${stats.attendanceRate}% attendance`}
          icon="✓"
          variant="success"
        />
        <StatCard
          title="Absent Today"
          value={loading ? '...' : stats.absent}
          subtitle={`${stats.onLeave} on approved leave`}
          icon="❌"
          variant="danger"
        />
        <StatCard
          title="Currently Checked In"
          value={loading ? '...' : stats.checkedIn}
          subtitle={`${stats.checkedOut} checked out`}
          icon="🕐"
          variant="info"
        />
      </div>

      {/* Secondary Stats - Only for HR/Admin */}
      {isHROrAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Leave Requests</p>
                <h3 className="text-2xl font-bold text-warning-600 dark:text-warning-400 mt-1">
                  {stats.pendingLeaves}
                </h3>
              </div>
              <div className="text-3xl">📝</div>
            </div>
          </Card>
          <Card variant="elevated" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">On Leave</p>
                <h3 className="text-2xl font-bold text-info-600 dark:text-info-400 mt-1">
                  {stats.onLeave}
                </h3>
              </div>
              <div className="text-3xl">🗓️</div>
            </div>
          </Card>
          <Card variant="elevated" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                  {stats.attendanceRate}%
                </h3>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card 
          title="Recent Activities" 
          subtitle="Latest updates from your team"
          className="lg:col-span-2"
          variant="elevated"
        >
          {loading ? (
            <div className="space-y-4">
              <Skeleton variant="text" count={4} />
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
            <Button 
              variant="link" 
              size="sm"
              onClick={() => navigate('/attendance')}
            >
              View all activities →
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card 
          title="Quick Actions" 
          subtitle="Common tasks"
          variant="elevated"
        >
          <div className="space-y-3">
            {/* HR/Admin only actions */}
            {isHROrAdmin && (
              <>
                <Button 
                  variant="primary" 
                  className="w-full justify-start"
                  onClick={() => navigate('/employees')}
                >
                  <span className="mr-2">➕</span>
                  Manage Employees
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/leaves')}
                >
                  <span className="mr-2">📝</span>
                  Leave Requests
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/attendance')}
                >
                  <span className="mr-2">🗓️</span>
                  Attendance Reports
                </Button>
              </>
            )}
            
            {/* Common actions for all */}
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/policies')}
            >
              <span className="mr-2">📑</span>
              View Policies
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/leave-policy')}
            >
              <span className="mr-2">📝</span>
              Amend Existing Policy
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/create-policy')}
            >
              <span className="mr-2">⚙️</span>
              Create New Policy
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/profile')}
            >
              <span className="mr-2">👨🏻‍💻</span>
              My Profile
            </Button>
          </div>
        </Card>
      </div>

      {/* Attendance Overview */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Attendance Overview"
          subtitle="This week's attendance"
          variant="elevated"
        >
          {loading ? (
            <Skeleton variant="card" />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monday</span>
                <div className="flex items-center gap-2">
                  <Badge variant="success">95%</Badge>
                  <span className="text-xs text-gray-500">38/40</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tuesday</span>
                <div className="flex items-center gap-2">
                  <Badge variant="success">92%</Badge>
                  <span className="text-xs text-gray-500">37/40</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wednesday</span>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">88%</Badge>
                  <span className="text-xs text-gray-500">35/40</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card
          title="Leave Status"
          subtitle="Current month overview"
          variant="elevated"
        >
          {loading ? (
            <Skeleton variant="card" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Approved Leaves</span>
                <span className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {stats.approvedLeaves}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</span>
                <span className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                  {stats.pendingLeaves}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                <span className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                  {stats.rejectedLeaves}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/leaves')}
                >
                  Review Pending Requests
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
