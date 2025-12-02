import { Link, useLocation } from "react-router-dom";
import { createPageUrl, cn } from "./utils";
import Button from "./Components/Button";
import { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import BoltIcon from "@mui/icons-material/Bolt";

const navigation = [
  { name: "Dashboard", page: "Dashboard", path: "/" },
  { name: "Employees", page: "Employees", path: "/employees" },
  { name: "Tasks", page: "Tasks", path: "/tasks" },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "Dashboard";
    if (path === "/employees") return "Employees";
    if (path === "/tasks") return "Tasks";
    return "Dashboard";
  };

  const currentPageName = getCurrentPage();

  return (
    <div className="app-layout">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div className="backdrop" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "sidebar",
          mobileSidebarOpen ? "mobile-open" : "",
          sidebarOpen ? "desktop-open" : "desktop-closed"
        )}
      >
        <div className="sidebar-inner">
          <div className="sidebar-header">
            <div className="logo">
              <BoltIcon />
            </div>
            {(sidebarOpen || mobileSidebarOpen) && (
              <span className="title">TaskFlow</span>
            )}
            <button
              className="toggle-sidebar-btn desktop-only"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </button>
            <button
              className="toggle-sidebar-btn mobile-only"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="nav">
            {navigation.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn("nav-item", isActive && "active")}
                  title={item.name}
                >
                  <span className="nav-icon">
                    {item.page === "Dashboard" && <DashboardIcon />}
                    {item.page === "Employees" && <PeopleIcon />}
                    {item.page === "Tasks" && <AssignmentIcon />}
                  </span>
                  {(sidebarOpen || mobileSidebarOpen) && (
                    <span className="nav-text">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            {(sidebarOpen || mobileSidebarOpen) && (
              <div className="footer-box">
                <p className="small">Task Tracker</p>
                <p className="xs">v1.0.0</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn("main-content", sidebarOpen ? "" : "sidebar-collapsed")}
      >
        {/* Mobile header */}
        <header className="mobile-header">
          <Button onClick={() => setMobileSidebarOpen(true)}>
            <MenuIcon /> Menu
          </Button>
          <div className="brand">TaskFlow</div>
        </header>

        {/* Page content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
