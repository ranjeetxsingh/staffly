import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader } from "..";

const AuthLayout = () => {
    const loading = useSelector((state) => state.loader.loading);
    
    if (loading) return <Loader />;

  return (
    <div className="overflow-x-hidden">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
