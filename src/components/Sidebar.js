"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/sidebar.css";

export default function Sidebar({ show, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "Anda akan keluar dari sesi ini.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-html-custom',
        confirmButton: 'swal2-confirm-btn-custom',
        cancelButton: 'swal2-cancel-btn-custom'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user_session");
        router.push("/login");
      }
    });
  };

  const menuItems = [
    { label: "Dashboard", icon: "bi-grid-1x2-fill", href: "/" },
    { label: "Aktivitas", icon: "bi-activity", href: "/aktivitas" },
  ];

  const masterData = [
    { label: "Data Unit", icon: "bi-truck-flatbed", href: "/master/unit" },
    { label: "Lokasi Pit/Site", icon: "bi-geo-alt", href: "/master/lokasi" },
    { label: "Data Mekanik", icon: "bi-people", href: "/master/mekanik" },
  ];

  const isAdmin = user?.role === 'admin';

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

          {/* Hanya tampilkan Master Data jika user adalah ADMIN */}
          {isAdmin && (
            <div className="sidebar-section mt-4 animate-fade-in">
              <p className="sidebar-section-label">Master Data</p>
              {masterData.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`nav-item-custom ${pathname.startsWith(item.href) ? 'active' : ''}`}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-mini">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=${isAdmin ? '2563eb' : '10b981'}&color=fff`} 
              className="rounded-circle shadow-sm" 
              width="35" 
              alt="user"
            />
            <div className="ms-2">
              <p className="mb-0 fw-bold text-truncate" style={{ fontSize: '0.8rem', maxWidth: '120px' }}>
                {user?.name || 'Loading...'}
              </p>
              <p className="mb-0 text-muted text-uppercase fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '0.5px' }}>
                {user?.role || 'Guest'}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-link p-0 ms-auto text-muted"
            >
              <i className="bi bi-box-arrow-right fs-5"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
