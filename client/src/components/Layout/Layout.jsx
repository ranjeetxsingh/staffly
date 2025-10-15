import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";
import { Loader } from "..";

const Layout = () => {
  const loading = useSelector((state) => state.loader.loading);

  if (loading) return <Loader />;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="scrollbar overflow-y-scroll flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
