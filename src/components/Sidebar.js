"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/sidebar.css";

export default function Sidebar({ show, onToggle }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", icon: "bi-grid-1x2-fill", href: "/" },
    { label: "Aktivitas", icon: "bi-activity", href: "/aktivitas" },
  ];

  const masterData = [
    { label: "Data Unit", icon: "bi-truck-flatbed", href: "/master/unit" },
    { label: "Lokasi Pit/Site", icon: "bi-geo-alt", href: "/master/lokasi" },
    { label: "Data Mekanik", icon: "bi-people", href: "/master/mekanik" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${show ? 'show' : ''}`} 
        onClick={onToggle}
      />

      <aside className={`sidebar ${show ? 'show' : 'hidden-desktop'}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <img 
              src="https://www.uniquip.co.id/wp-content/uploads/2023/02/Logo-Uniquip-Hitam.png" 
              alt="Uniquip Logo" 
              style={{ height: "40px", objectFit: "contain" }}
            />
          </Link>
          <button className="sidebar-toggle-btn" onClick={onToggle}>
            <i className="bi bi-chevron-left"></i>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <p className="sidebar-section-label">Main Menu</p>
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`nav-item-custom ${pathname === item.href ? 'active' : ''}`}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="sidebar-section mt-4">
            <p className="sidebar-section-label">Master Data</p>
            {masterData.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`nav-item-custom ${pathname === item.href ? 'active' : ''}`}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-mini">
            <img 
              src="https://ui-avatars.com/api/?name=Yudistira+Rivaldi&background=2563eb&color=fff" 
              className="rounded-circle shadow-sm" 
              width="35" 
              alt="user"
            />
            <div className="ms-2">
              <p className="mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Yudis Rivaldi</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>Log Out</p>
            </div>
            <i className="bi bi-box-arrow-right ms-auto text-muted cursor-pointer"></i>
          </div>
        </div>
      </aside>
    </>
  );
}
