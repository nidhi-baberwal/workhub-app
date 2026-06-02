import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";
import "../../App.css";

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="layout-body">
        <Sidebar />

        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;