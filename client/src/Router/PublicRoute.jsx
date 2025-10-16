import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard based on their role
    if (user?.role === 'admin' || user?.role === 'hr') {
      return <Navigate to="/dashboard" replace />;
    }
    // Regular employees go to home or dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;