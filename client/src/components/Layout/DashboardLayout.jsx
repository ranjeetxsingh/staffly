import { Outlet } from "react-router-dom";
// import { Sidebar } from "..";
import { useState } from "react";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex h-[90vh]">
      {/* <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      <main className={`flex-1 p-6 transition-all duration-300 ${isOpen ? 'ml-50' : 'ml-18'} `}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
