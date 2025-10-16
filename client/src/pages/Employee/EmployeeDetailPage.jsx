import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Modal,
  Input,
  Badge,
  Skeleton,
  Tabs,
  Table,
} from '../../components/UI';
import { useEmployee, useEmployeeActions } from '../../Hooks/useEmployee';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../Hooks/useToast';
import { useSelector } from 'react-redux';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const user = useSelector((state) => state.auth.user);
  
  const { employee, loading, refetch } = useEmployee(id);
  const [isEditBalanceModalOpen, setIsEditBalanceModalOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState(null);
  const [balanceFormData, setBalanceFormData] = useState({
    total: 0,
    used: 0,
    carriedForward: 0,
  });
  const [reinitializing, setReinitializing] = useState(false);

  const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';

  const handleReinitializeLeaves = async () => {
    if (!window.confirm('This will reset all leave balances to default values from the active policy. Continue?')) {
      return;
    }

    try {
      setReinitializing(true);
      await employeeService.reinitializeLeaves(id);
      showSuccess('Leave balances reinitialized successfully!');
      refetch();
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to reinitialize leave balances');
      console.error('Reinitialize error:', error);
    } finally {
      setReinitializing(false);
    }
  };

  const openEditBalanceModal = (balance) => {
    setSelectedBalance(balance);
    setBalanceFormData({
      total: balance.total,
      used: balance.used,
      carriedForward: balance.carriedForward || 0,
    });
    setIsEditBalanceModalOpen(true);
  };

  const handleUpdateBalance = async () => {
    try {
      await employeeService.updateLeaveBalance(id, {
        leaveType: selectedBalance.leaveType,
        total: Number(balanceFormData.total),
        used: Number(balanceFormData.used),
        carriedForward: Number(balanceFormData.carriedForward),
      });
      showSuccess('Leave balance updated successfully!');
      setIsEditBalanceModalOpen(false);
      refetch();
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to update leave balance');
      console.error('Update balance error:', error);
    }
  };

  const leaveBalanceColumns = [
    {
      key: 'leaveType',
      label: 'Leave Type',
      render: (value) => (
        <span className="capitalize font-medium text-gray-900 dark:text-white">
          {value}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (value) => `${value} days`,
    },
    {
      key: 'used',
      label: 'Used',
      render: (value) => (
        <Badge variant="warning">{value} days</Badge>
      ),
    },
    {
      key: 'available',
      label: 'Available',
      render: (value) => (
        <Badge variant={value > 0 ? 'success' : 'danger'}>
          {value} days
        </Badge>
      ),
    },
    {
      key: 'carriedForward',
      label: 'Carried Forward',
      render: (value) => `${value || 0} days`,
    },
    ...(isHROrAdmin
      ? [
          {
            key: '_id',
            label: 'Actions',
            render: (_, row) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditBalanceModal(row)}
              >
                ✏️ Edit
              </Button>
            ),
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
        <Card>
          <Skeleton variant="text" count={10} />
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Employee Not Found
            </h2>
            <Button variant="primary" onClick={() => navigate('/employees')}>
              Back to Employees
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/employees')}>
            ← Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {employee.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{employee.email}</p>
          </div>
        </div>
        <Badge variant={employee.status === 'active' ? 'success' : 'danger'}>
          {employee.status}
        </Badge>
      </div>

      {/* Employee Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Employee ID
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee.employeeId || 'N/A'}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Department
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee.department || 'N/A'}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Designation
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee.designation || 'N/A'}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Role
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {employee.role || 'employee'}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Phone
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee.phone || 'N/A'}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Joining Date
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee.joiningDate
              ? new Date(employee.joiningDate).toLocaleDateString()
              : 'N/A'}
          </p>
        </Card>
      </div>

      {/* Leave Balances */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Leave Balances
          </h2>
          {isHROrAdmin && (
            <Button
              variant="primary"
              onClick={handleReinitializeLeaves}
              disabled={reinitializing}
            >
              {reinitializing ? '⏳ Reinitializing...' : '🔄 Reinitialize Leave Balances'}
            </Button>
          )}
        </div>

        {employee.leaveBalances && employee.leaveBalances.length > 0 ? (
          <Table
            columns={leaveBalanceColumns}
            data={employee.leaveBalances}
            striped
            hoverable
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No leave balances found for this employee.
            </p>
            {isHROrAdmin && (
              <Button variant="primary" onClick={handleReinitializeLeaves}>
                Initialize Leave Balances
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Edit Leave Balance Modal */}
      {isHROrAdmin && (
        <Modal
          isOpen={isEditBalanceModalOpen}
          onClose={() => {
            setIsEditBalanceModalOpen(false);
            setSelectedBalance(null);
          }}
          title={`Edit ${selectedBalance?.leaveType} Leave Balance`}
          size="md"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditBalanceModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateBalance}>
                Update Balance
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Total Days"
              type="number"
              min="0"
              value={balanceFormData.total}
              onChange={(e) =>
                setBalanceFormData({ ...balanceFormData, total: e.target.value })
              }
            />
            <Input
              label="Used Days"
              type="number"
              min="0"
              max={balanceFormData.total}
              value={balanceFormData.used}
              onChange={(e) =>
                setBalanceFormData({ ...balanceFormData, used: e.target.value })
              }
            />
            <Input
              label="Carried Forward Days"
              type="number"
              min="0"
              value={balanceFormData.carriedForward}
              onChange={(e) =>
                setBalanceFormData({
                  ...balanceFormData,
                  carriedForward: e.target.value,
                })
              }
            />
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
              <p className="text-sm text-primary-800 dark:text-primary-200">
                <strong>Available Days:</strong>{' '}
                {Number(balanceFormData.total) +
                  Number(balanceFormData.carriedForward) -
                  Number(balanceFormData.used)}{' '}
                days
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeDetailPage;
