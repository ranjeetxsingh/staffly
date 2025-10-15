import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authToken =  useSelector((state) => state.auth.authToken);

  return authToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
