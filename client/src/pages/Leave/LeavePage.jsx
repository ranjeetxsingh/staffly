import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Button,
  Table,
  Modal,
  Input,
  Select,
  Textarea,
  Badge,
  Skeleton,
  Tabs,
} from '../../components/UI';
import { useLeave } from '../../Hooks/useLeave';
import { useToast } from '../../Hooks/useToast';

const LeavePage = () => {
  const { user } = useSelector((state) => state.auth);
  const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';
  const isEmployee = !isHROrAdmin;
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  // Set default active tab based on role: employees start with My Leaves, HR/Admin start with Pending Approvals
  const [activeTab, setActiveTab] = useState(isEmployee ? 0 : 1);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [remarks, setRemarks] = useState('');

  const {
    leaves,
    loading,
    applyLeave,
    approveLeave,
    rejectLeave,
    fetchMyLeaves,
    fetchPendingLeaves,
    fetchAllLeaves,
  } = useLeave();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadLeaves();
  }, [activeTab]);

  useEffect(() => {
    console.log('📋 Leaves Data:', {
      leaves,
      leavesLength: leaves?.length,
      firstLeave: leaves?.[0],
      activeTab,
      isEmployee,
      isHROrAdmin
    });
  }, [leaves]);

  const loadLeaves = async () => {
    try {
      if (activeTab === 0) {
        await fetchMyLeaves();
      } else if (activeTab === 1) {
        await fetchPendingLeaves();
      } else {
        await fetchAllLeaves();
      }
    } catch (error) {
      showError('Failed to load leaves');
    }
  };

  const handleApplyLeave = async () => {
    // Validate required fields
    if (!formData.leaveType) {
      showError('Please select a leave type');
      return;
    }
    if (!formData.startDate) {
      showError('Please select a start date');
      return;
    }
    if (!formData.endDate) {
      showError('Please select an end date');
      return;
    }
    if (!formData.reason || formData.reason.trim().length === 0) {
      showError('Please provide a reason for leave');
      return;
    }

    // Validate date range
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      showError('End date must be after or equal to start date');
      return;
    }

    try {
      // Map frontend field names to backend field names
      const leaveData = {
        leaveType: formData.leaveType,
        fromDate: formData.startDate,
        toDate: formData.endDate,
        reason: formData.reason,
      };
      
      await applyLeave(leaveData);
      showSuccess('Leave application submitted successfully!');
      setIsApplyModalOpen(false);
      resetForm();
      loadLeaves();
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to apply for leave');
      console.error('Apply leave error:', error);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await approveLeave(leaveId);
      showSuccess('Leave approved successfully!');
      loadLeaves();
    } catch (error) {
      showError('Failed to approve leave');
    }
  };

  const handleReject = async (leaveId, data) => {
    try {
      await rejectLeave(leaveId, data);
      showSuccess('Leave rejected successfully!');
      loadLeaves();
    } catch (error) {
      console.log(error);
      showError(error?.message || 'Failed to reject leave');
    }
  };

  const resetForm = () => {
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const tableColumns = [
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value || row.employee?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.employee?.email}</p>
        </div>
      ),
    },
    {
      key: 'leaveType',
      label: 'Type',
      render: (value) => (
        <Badge variant="primary" size="sm">
          {value?.toUpperCase() || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'fromDate',
      label: 'Start Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'toDate',
      label: 'End Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'numberOfDays',
      label: 'Days',
      render: (value) => value || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          variant={
            value === 'approved' ? 'success' :
            value === 'rejected' ? 'danger' :
            value === 'pending' ? 'warning' :
            'default'
          }
        >
          {value?.toUpperCase() || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'remark',
      label: 'Remark',
      render: (_, row) =>
        row.status === 'pending' && activeTab === 1 ? (
          <input
            type="text"
            placeholder="Enter remark"
            value={remarks[row._id] || ''}
            onChange={(e) => setRemarks({ ...remarks, [row._id]: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        ) : (
          <span className="text-gray-500 dark:text-gray-400">{row.remark || '-'}</span>
        ),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (value, row) => {
        if (row.status === 'pending' && activeTab === 1) {
          return (
            <div className="flex gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleApprove(value)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReject(value, remarks ? remarks[value] : '')}
              >
                Reject
              </Button>
            </div>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
  ];

  // Define tabs based on role
  const getTabsData = () => {
    const myLeavesTab = {
      label: 'My Leaves',
      icon: '📋',
      content: (
        <Card>
          {loading ? (
            <Skeleton variant="text" count={5} />
          ) : (
            <Table
              columns={tableColumns.filter(col => col.key !== '_id' && col.key !== 'employeeName')}
              data={leaves || []}
              striped
              hoverable
              emptyMessage="No leave records found"
            />
          )}
        </Card>
      ),
    };

    const pendingApprovalsTab = {
      label: 'Pending Approvals',
      icon: '⏳',
      badge: leaves?.filter(l => l.status === 'pending')?.length || 0,
      content: (
        <Card>
          {loading ? (
            <Skeleton variant="text" count={5} />
          ) : (
            <Table
              columns={tableColumns}
              data={leaves?.filter(l => l.status === 'pending') || []}
              striped
              hoverable
              emptyMessage="No pending approvals"
            />
          )}
        </Card>
      ),
    };

    const allLeavesTab = {
      label: 'All Leaves',
      icon: '📊',
      content: (
        <Card>
          {loading ? (
            <Skeleton variant="text" count={5} />
          ) : (
            <Table
              columns={tableColumns}
              data={leaves || []}
              striped
              hoverable
              emptyMessage="No leave records found"
            />
          )}
        </Card>
      ),
    };

    // Employees see only My Leaves tab
    if (isEmployee) {
      return [myLeavesTab];
    }

    // HR/Admin see Pending Approvals, All Leaves, and optionally My Leaves
    return [myLeavesTab, pendingApprovalsTab, allLeavesTab];
  };

  const tabsData = getTabsData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEmployee ? 'My Leaves' : 'Leave Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEmployee 
              ? 'View and apply for leaves'
              : 'Manage leave applications and approvals'
            }
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsApplyModalOpen(true)}
        >
          ➕ Apply for Leave
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card variant="elevated">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Leaves</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {leaves?.length || 0}
            </h3>
          </div>
        </Card>
        <Card variant="elevated">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
            <h3 className="text-3xl font-bold text-success-600 dark:text-success-400 mt-2">
              {leaves?.filter(l => l.status === 'approved')?.length || 0}
            </h3>
          </div>
        </Card>
        <Card variant="elevated">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <h3 className="text-3xl font-bold text-warning-600 dark:text-warning-400 mt-2">
              {leaves?.filter(l => l.status === 'pending')?.length || 0}
            </h3>
          </div>
        </Card>
        <Card variant="elevated">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
            <h3 className="text-3xl font-bold text-danger-600 dark:text-danger-400 mt-2">
              {leaves?.filter(l => l.status === 'rejected')?.length || 0}
            </h3>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabsData}
        defaultActiveTab={activeTab}
        variant="pills"
        onChange={(index) => setActiveTab(index)}
      />

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          resetForm();
        }}
        title="Apply for Leave"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyLeave}>
              Submit Application
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Leave Type"
            placeholder="Select leave type"
            options={[
              { value: 'sick', label: 'Sick Leave' },
              { value: 'casual', label: 'Casual Leave' },
              { value: 'annual', label: 'Annual Leave' },
              { value: 'maternity', label: 'Maternity Leave' },
              { value: 'paternity', label: 'Paternity Leave' },
              { value: 'unpaid', label: 'Unpaid Leave' },
            ]}
            value={formData.leaveType}
            onChange={(value) => setFormData({ ...formData, leaveType: value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          {formData.startDate && formData.endDate && (
            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
              <p className="text-sm text-primary-800 dark:text-primary-200">
                Total Days: <span className="font-bold">{calculateDays()}</span>
              </p>
            </div>
          )}
          <Textarea
            label="Reason"
            placeholder="Enter reason for leave..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={4}
            maxLength={500}
            showCount
            required
          />
        </div>
      </Modal>
    </div>
  );
};

export default LeavePage;
