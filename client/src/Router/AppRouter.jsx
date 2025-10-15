import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Layout from "../components/Layout/Layout";
import ScrollToTop from "../components/common/ScrollToTop";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Dashboard from '../pages/Dashboard/Dashboard';
import AuthLayout from '../components/Layout/AuthLayout';
import { useSelector } from "react-redux";
import Contact from '../pages/Contact/Contact';
import RoleBasedRoute from "./RoleBasedRoute";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Bills from "../pages/Bills/Bills";
import Profile from "../pages/Profile/Profile";
import Policies from "../pages/Policies/Policies";
import AttendancePage from "../pages/Attendance/AttendancePage";


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
            
            
          <Route path="attendance" element={
            <PrivateRoute>
              <AttendancePage />
            </PrivateRoute>
            } />
             <Route path="leaves" element={
            <PrivateRoute>
              <Bills />
            </PrivateRoute>
            } />
          <Route path="policies" element={<Policies />} />
          <Route path="profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />  

          {/* protected route  */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
              <RoleBasedRoute allowedRoles={['admin', 'hr']}>
                <Dashboard />
              </RoleBasedRoute>
              </PrivateRoute>
            }
          >
          </Route>
        </Route>

        {/* auth pages without navbar */}
        <Route path="/" element={<AuthLayout />} >
          <Route path="login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="register" element={
            <PublicRoute>
              <Signup />
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

{/* <Route path="/attendance" element={<AttendancePage />} />
<Route path="/leaves" element={<LeavePage />} />
<Route path="/employees" element={<EmployeePage />} />
<Route path="/analytics" element={<AnalyticsPage />} />
<Route path="/policies" element={<PolicyPage />} /> */}
