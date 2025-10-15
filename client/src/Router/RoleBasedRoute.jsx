import { useSelector } from "react-redux";
import AccessDenied from "../Pages/AccessDenied/AccessDenied";

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const user = useSelector((state) => state.auth.user);
    
    return allowedRoles.includes(user?.role) ? children : <AccessDenied />;
};

export default RoleBasedRoute;