import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Card,
  Button,
  Table,
  Modal,
  Input,
  Select,
  Textarea,
  Avatar,
  Badge,
  Skeleton,
  Dropdown,
} from '../../components/UI';
import { useEmployees, useEmployeeActions } from '../../Hooks/useEmployee';
import { useToast } from '../../Hooks/useToast';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isHROrAdmin = user?.role === 'admin' || user?.employeeRole === 'hr' || user?.employeeRole === 'admin';
  
  // Redirect if not HR/Admin
  useEffect(() => {
    if (!isHROrAdmin) {
      navigate('/access-denied');
    }
  }, [isHROrAdmin, navigate]);
  
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    role: 'employee',
    salary: '',
    joiningDate: '',
    address: '',
  });

  // Use separate hooks for data and actions
  const { employees, loading, refetch: fetchAllEmployees } = useEmployees({ autoFetch: true });
  const { 
    addEmployee: addEmployeeAction, 
    updateEmployee: updateEmployeeAction, 
    deleteEmployee: deleteEmployeeAction,
    loading: actionLoading 
  } = useEmployeeActions();
  
  const { showSuccess, showError } = useToast();

  const handleAddEmployee = async () => {
    try {
      await addEmployeeAction(formData);
      showSuccess('Employee added successfully!');
      setIsAddModalOpen(false);
      resetForm();
      fetchAllEmployees();
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to add employee');
      console.error('Add employee error:', error);
    }
  };

  const handleEditEmployee = async () => {
    try {
      await updateEmployeeAction(selectedEmployee._id, formData);
      showSuccess('Employee updated successfully!');
      setIsEditModalOpen(false);
      resetForm();
      fetchAllEmployees();
    } catch (error) {
      showError(error?.response?.data?.message || 'Failed to update employee');
      console.error('Update employee error:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to terminate this employee?')) {
      try {
        await deleteEmployeeAction(id);
        showSuccess('Employee terminated successfully!');
        fetchAllEmployees();
      } catch (error) {
        showError(error?.response?.data?.message || 'Failed to delete employee');
        console.error('Delete employee error:', error);
      }
    }
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      designation: employee.designation || '',
      salary: employee.salary || '',
      joiningDate: employee.joiningDate?.split('T')[0] || '',
      address: employee.address || '',
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      salary: '',
      joiningDate: '',
      address: '',
    });
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees?.filter((emp) => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  }) || [];

  const departments = [...new Set(employees?.map(e => e.department).filter(Boolean))] || [];

  const tableColumns = [
    {
      key: 'name',
      label: 'Employee',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={value} size="sm" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'}>
          {value || 'Active'}
        </Badge>
      ),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (value, row) => (
        <Dropdown
          trigger={
            <Button variant="ghost" size="sm">
              ⋮
            </Button>
          }
          items={[
            {
              label: 'View Details',
              icon: '👁️',
              onClick: () => navigate(`/employees/${value}`),
            },
            {
              label: 'Edit',
              icon: '✏️',
              onClick: () => openEditModal(row),
            },
            { divider: true },
            {
              label: 'Delete',
              icon: '🗑️',
              danger: true,
              onClick: () => handleDeleteEmployee(value),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Employee Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your workforce and employee information
        </p>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-3 flex-1 w-full">
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<span>🔍</span>}
              className="flex-1"
            />
            <Select
              placeholder="Filter by department"
              options={[
                { value: '', label: 'All Departments' },
                ...departments.map(d => ({ value: d, label: d }))
              ]}
              value={filterDepartment}
              onChange={setFilterDepartment}
              className="md:w-64"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              📋 Table
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              ➕ Add Employee
            </Button>
          </div>
        </div>
      </Card>

      {/* Employee List */}
      {loading ? (
        <Card>
          <Skeleton variant="text" count={5} />
        </Card>
      ) : viewMode === 'table' ? (
        <Card>
          <Table
            columns={tableColumns}
            data={filteredEmployees}
            striped
            hoverable
            emptyMessage="No employees found"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee._id} variant="elevated" hoverable>
              <div className="text-center">
                <Avatar name={employee.name} size="xl" className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {employee.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {employee.designation}
                </p>
                <Badge variant="primary" size="sm">
                  {employee.department}
                </Badge>
                <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>📧 {employee.email}</p>
                  <p>📱 {employee.phone}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditModal(employee)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/employees/${employee._id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Employee"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddEmployee}>
              Add Employee
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Department"
            placeholder="Engineering"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <Input
            label="Designation"
            placeholder="Software Engineer"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          />
          <Input
            label="Salary"
            type="number"
            placeholder="50000"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />
          <Input
            label="Joining Date"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          />
          <div className="md:col-span-2">
            <Textarea
              label="Address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Employee"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditEmployee}>
              Update Employee
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Department"
            placeholder="Engineering"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <Input
            label="Designation"
            placeholder="Software Engineer"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          />
          <Input
            label="Salary"
            type="number"
            placeholder="50000"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />
          <Input
            label="Joining Date"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          />
          <div className="md:col-span-2">
            <Textarea
              label="Address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeListPage;
