import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (user?.role === 'admin' || user?.role === 'ngo') {
      return <Navigate to="/dashboard/welcome" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;