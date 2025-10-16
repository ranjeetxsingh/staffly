import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Layout from "../Components/Layout/Layout";
import ScrollToTop from "../Components/common/ScrollToTop";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import Dashboard from '../pages/Dashboard/Dashboard';
import AuthLayout from '../Components/Layout/AuthLayout';
import { useSelector } from "react-redux";
import RoleBasedRoute from "./RoleBasedRoute";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/Profile/ProfilePage";
import Policies from "../pages/Policies/Policies";
import AttendancePage from "../pages/Attendance/AttendancePage";
import EmployeeListPage from "../pages/Employee/EmployeeListPage";
import EmployeeDetailPage from "../pages/Employee/EmployeeDetailPage";
import LeavePage from "../pages/Leave/LeavePage";
import AccessDenied from "../Pages/AccessDenied/AccessDenied";


const AppRouter = () => {

  const authUser = useSelector((state) => state.auth.user);
  const authToken = useSelector((state) => state.auth.token);
  console.log("User is logged in :", authUser, "Token is :", authToken);
  return (
    <Router >
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="" element={<Home />} />
            
          {/* Attendance */}  
          <Route path="attendance" element={
            <PrivateRoute>
              <AttendancePage />
            </PrivateRoute>
            } />
          
          {/* Leaves */}
          <Route path="leaves" element={
            <PrivateRoute>
              <LeavePage />
            </PrivateRoute>
            } />
          
          {/* Employees */}
          <Route path="employees" element={
            <PrivateRoute>
              <EmployeeListPage />
            </PrivateRoute>
            } />
          <Route path="employees/:id" element={
            <PrivateRoute>
              <EmployeeDetailPage />
            </PrivateRoute>
            } />

          {/* Policies */}
          <Route path="policies" element={<Policies />} />
          
          {/* Profile */}
          <Route path="profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />  

          {/* Dashboard - protected route  */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
          </Route>

          {/* Access Denied */}
          <Route path="access-denied" element={<AccessDenied />} />
        </Route>

        {/* auth pages without navbar */}
        <Route path="/" element={<AuthLayout />} >
          <Route path="login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="register" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
          <Route path="signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
