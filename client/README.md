# 🏢 HRMS Staffly - Frontend Application

> Modern Human Resource Management System built with React, Vite, and a comprehensive API service layer.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Documentation](#documentation)
- [Development](#development)
- [Available Scripts](#available-scripts)

---

## 🎯 Overview

HRMS Staffly is a complete human resource management system with features for:
- Employee Management
- Attendance Tracking
- Leave Management
- Policy Administration
- Analytics & Reporting

This frontend application provides a modern, responsive UI with seamless backend integration through a comprehensive API service layer.

---

## ✨ Features

### 🔐 Authentication
- Email/Password login
- Google OAuth integration
- Secure token management
- Auto-logout on session expiry

### 👥 Employee Management
- Employee CRUD operations
- Department management
- Profile management
- Employee statistics & analytics

### ⏰ Attendance Tracking
- Quick check-in/check-out
- Real-time attendance monitoring
- Monthly attendance reports
- Attendance statistics

### 📝 Leave Management
- Apply for leave
- Leave balance tracking
- Leave approval workflow (HR/Admin)
- Leave history & status

### 📋 Policy Management
- Leave policies
- Attendance policies
- Policy administration (HR/Admin)

### 📊 Analytics
- Employee productivity metrics
- Attendance trends
- Department-wise analytics
- Custom reports

---

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Custom Hooks** - Reusable logic

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running on `http://localhost:3000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd staffly/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo "VITE_SERVER_URL=http://localhost:3000" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
client/
├── src/
│   ├── API/                    # API layer - raw API calls
│   │   ├── authAPI.js         # Authentication endpoints
│   │   ├── employeeAPI.js     # Employee endpoints
│   │   ├── attendanceAPI.js   # Attendance endpoints
│   │   ├── leaveAPI.js        # Leave endpoints
│   │   ├── policyAPI.js       # Policy endpoints
│   │   ├── analyticsAPI.js    # Analytics endpoints
│   │   └── index.js           # Central export
│   │
│   ├── services/              # Service layer - business logic
│   │   ├── authService.js
│   │   ├── employeeService.js
│   │   ├── attendanceService.js
│   │   ├── leaveService.js
│   │   ├── policyService.js
│   │   └── index.js
│   │
│   ├── Hooks/                 # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useEmployee.js
│   │   ├── useAttendance.js
│   │   ├── useLeave.js
│   │   ├── usePolicy.js
│   │   └── index.js
│   │
│   ├── components/            # Reusable components
│   │   ├── common/           # Common components
│   │   ├── Layout/           # Layout components
│   │   ├── Navbar/           # Navigation
│   │   └── ...
│   │
│   ├── pages/                # Page components
│   │   ├── Dashboard/
│   │   ├── Employee/
│   │   ├── Attendance/
│   │   ├── Leave/
│   │   └── ...
│   │
│   ├── Router/               # Route configuration
│   ├── store/                # Redux store
│   ├── utils/                # Utilities
│   │   └── axios.js         # Axios instance
│   └── examples/            # Example components
│
├── API_DOCUMENTATION.md      # Complete API docs
├── INTEGRATION_GUIDE.md      # Integration instructions
├── QUICK_START.md           # Quick start guide
├── PROJECT_SUMMARY.md       # Project summary
└── README.md                # This file
```

---

## 🔌 API Integration

### Quick Example

```javascript
// Using Hooks (Recommended)
import { useMyLeaves } from './Hooks';

function MyComponent() {
  const { leaves, loading, error } = useMyLeaves();
  
  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  
  return <LeaveList data={leaves} />;
}
```

```javascript
// Using Services
import { leaveService } from './services';

const leaves = await leaveService.getMyLeaves({ status: 'pending' });
```

```javascript
// Using Raw API
import { leaveAPI } from './API';

const response = await leaveAPI.getMyLeaves({ status: 'pending' });
```

### Key Features

✅ **Automatic Token Management** - Tokens automatically attached to requests  
✅ **Error Handling** - Standardized error format  
✅ **Loading States** - Built-in loading state management  
✅ **Auto Logout** - Automatic redirect on 401  
✅ **Data Unwrapping** - Response data automatically unwrapped  

---

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Integration Guide](INTEGRATION_GUIDE.md)** - Step-by-step integration
- **[Project Summary](PROJECT_SUMMARY.md)** - Detailed project overview

---

## 💻 Development

### Available Hooks

**Authentication**
- `useAuth()` - Login, logout, authentication state

**Employees**
- `useMyProfile()` - Current user profile
- `useEmployees(params)` - List employees with filters
- `useEmployeeActions()` - Add, update, delete employees

**Attendance**
- `useAttendance()` - Check-in/check-out functionality
- `useAttendanceRecords(params)` - View attendance records

**Leaves**
- `useMyLeaves(params)` - User's leave applications
- `useLeaveBalance()` - Leave balance
- `useLeaveApplication()` - Apply for leave

**Policies**
- `useActiveLeavePolicy()` - Active leave policy
- `usePolicies(params)` - Manage policies (HR/Admin)

### Code Style

```javascript
// ✅ Good - Use hooks
const { data, loading } = useMyData();

// ✅ Good - Handle errors
try {
  await service.action();
} catch (error) {
  showError(error.message);
}

// ✅ Good - Show loading states
if (loading) return <Loader />;

// ❌ Avoid - Direct axios calls
import axios from 'axios';
await axios.get('/api/endpoint');
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## 🌐 Environment Variables

Create a `.env` file:

```env
VITE_SERVER_URL=http://localhost:3000
```

---

## 🔧 Configuration

### Vite Configuration

See `vite.config.js` for build and dev server configuration.

### ESLint Configuration

See `eslint.config.js` for linting rules.

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Follow the code style guidelines
4. Update documentation
5. Submit a pull request

---

## 📝 Best Practices

1. ✅ Always use hooks in components
2. ✅ Handle loading and error states
3. ✅ Show user feedback for actions
4. ✅ Use the service layer (don't make direct API calls)
5. ✅ Refetch data after mutations
6. ✅ Keep components small and focused
7. ✅ Write meaningful variable names
8. ✅ Add comments for complex logic

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Token not sent with requests**
- Make sure you're using `axios` from `./utils/axios.js`

**Issue: Data is undefined**
- Response data is already unwrapped, don't use `response.data.data`

**Issue: Infinite re-renders**
- Don't call refetch in useEffect without dependencies

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for more troubleshooting.

---

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review example components in `src/examples/`
3. Check the backend API documentation
4. Review the Postman collection

---

## 📄 License

[Add your license here]

---

## 🎉 Acknowledgments

Built with ❤️ using modern web technologies.

- React Team for React
- Vite Team for Vite
- All open-source contributors

---

**Happy Coding! 🚀**
