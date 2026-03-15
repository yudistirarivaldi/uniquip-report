"use client"

import { useState } from "react";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapClient from "../components/BootstrapClient";
import Sidebar from "../components/Sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true); // Default open on desktop
  const pathname = usePathname();

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/login";

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <html lang="id">
      <body>
        <BootstrapClient />
        {!isLoginPage ? (
          <div className="d-flex">
            <Sidebar show={showSidebar} onToggle={toggleSidebar} />
            
            {/* Main Content Wrapper */}
            <div className={`main-wrapper w-100 ${!showSidebar ? 'full-width' : ''}`}>
              
              {/* Floating trigger button (visible when sidebar is hidden) */}
              {!showSidebar && (
                <button 
                  className="sidebar-trigger-sticky d-none d-lg-flex"
                  onClick={toggleSidebar}
                >
                  <i className="bi bi-layout-sidebar"></i>
                </button>
              )}

              {/* Header for mobile toggle */}
              <div className="d-lg-none p-3 bg-white border-bottom sticky-top d-flex align-items-center justify-content-between">
                <img 
                  src="https://www.uniquip.co.id/wp-content/uploads/2023/02/Logo-Uniquip-Hitam.png" 
                  alt="Uniquip Logo" 
                  style={{ height: "30px", objectFit: "contain" }}
                />
                <button 
                  className="btn btn-light border"
                  onClick={toggleSidebar}
                >
                  <i className="bi bi-list fs-4"></i>
                </button>
              </div>

              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
