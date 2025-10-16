import { FiHome } from "react-icons/fi"; 
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { GiPalmTree } from "react-icons/gi";
import { FaRegHandshake } from "react-icons/fa";
import { MdDashboard, MdPeople, MdAnalytics } from "react-icons/md";

// Employee Navigation Menu
export const EmployeeNavbarMenu = [
    {
        id: 1,
        key: "home",
        title: "Home",
        link: "/",
        icon: <FiHome />,
    },
    {
        id: 2,
        key: "attendance",
        title: "Attendance",
        link: "/attendance",
        icon: <HiMiniCalendarDateRange />,
        description: "Check in/out and view your attendance"
    },
    {
        id: 3,
        key: "leaves",
        title: "My Leaves",
        link: "/leaves",
        icon: <GiPalmTree />,
        description: "Apply and manage your leaves"
    },
    {
        id: 4,
        key: "policies",
        title: "Policies",
        link: "/policies",
        icon: <FaRegHandshake />,
        description: "View company policies"
    }
];

// HR Navigation Menu
export const HRNavbarMenu = [
    {
        id: 1,
        key: "dashboard",
        title: "Dashboard",
        link: "/dashboard",
        icon: <MdDashboard />,
        description: "HR dashboard and analytics"
    },
    {
        id: 2,
        key: "employees",
        title: "Employees",
        link: "/employees",
        icon: <MdPeople />,
        description: "Manage employee records"
    },
    {
        id: 3,
        key: "leaves",
        title: "Leave Requests",
        link: "/leaves",
        icon: <GiPalmTree />,
        description: "Approve/reject leave requests"
    },
    {
        id: 4,
        key: "analytics",
        title: "Analytics",
        link: "/analytics",
        icon: <MdAnalytics />,
        description: "View reports and analytics"
    },
    {
        id: 5,
        key: "policies",
        title: "Policies",
        link: "/policies",
        icon: <FaRegHandshake />,
        description: "Manage company policies"
    }
];

// Admin Navigation Menu
export const AdminNavbarMenu = [
    {
        id: 1,
        key: "dashboard",
        title: "Dashboard",
        link: "/dashboard",
        icon: <MdDashboard />,
        description: "Admin dashboard overview"
    },
    {
        id: 2,
        key: "employees",
        title: "Employees",
        link: "/employees",
        icon: <MdPeople />,
        description: "Manage all employees"
    },
    {
        id: 3,
        key: "leaves",
        title: "Leave Management",
        link: "/leaves",
        icon: <GiPalmTree />,
        description: "Manage leave requests"
    },
    {
        id: 4,
        key: "attendance",
        title: "Attendance",
        link: "/attendance",
        icon: <HiMiniCalendarDateRange />,
        description: "View attendance reports"
    },
    {
        id: 5,
        key: "analytics",
        title: "Analytics",
        link: "/analytics",
        icon: <MdAnalytics />,
        description: "System-wide analytics"
    },
    {
        id: 6,
        key: "policies",
        title: "Policies",
        link: "/policies",
        icon: <FaRegHandshake />,
        description: "Manage policies"
    }
];

/**
 * Get navigation menu based on user role
 * @param {Object} user - User object with role and employeeRole
 * @returns {Array} - Navigation menu items
 */
export const getNavbarMenuByRole = (user) => {
    if (!user) return EmployeeNavbarMenu;
    
    // Check if user is admin (either in User.role or Employee.role)
    const isAdmin = user.role === 'admin' || user.employeeRole === 'admin';
    
    // Check if user is HR
    const isHR = user.employeeRole === 'hr';
    
    if (isAdmin) {
        return AdminNavbarMenu;
    } else if (isHR) {
        return HRNavbarMenu;
    } else {
        return EmployeeNavbarMenu;
    }
};

// Legacy export for backward compatibility
export const NavbarMenu = EmployeeNavbarMenu;
