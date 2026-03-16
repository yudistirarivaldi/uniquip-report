"use client"

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import "../styles/dashboard.css";

export default function Home() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [zoomedImg, setZoomedImg] = useState(null);
  const [filter, setFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ready: 0, down: 0, maintenance: 0, activityToday: 0 });
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Weather State
  const [weather, setWeather] = useState({
    temp: "--",
    condition: "Memuat Cuaca...",
    city: "Mencari Lokasi...",
    icon: "bi-cloud-sun"
  });

  useEffect(() => {
    fetchDashboardData();
    fetchRealtimeWeather();

    // Timer Countdown & Refresh Logic
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchDashboardData(false);
          fetchRealtimeWeather();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    fetchDashboardData(true);
    fetchRealtimeWeather();
    setCountdown(60);
  };

  const fetchRealtimeWeather = () => {
    if (!navigator.geolocation) {
      setWeather(prev => ({ ...prev, city: "Akses Lokasi Mati", condition: "Gagal Deteksi" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // 1. Ambil Nama Kota (Reverse Geocoding) - Gratis pakai Nominatim
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const geoData = await geoRes.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.village || "Site Banjarbaru";

        // 2. Ambil Cuaca Realtime - Gratis pakai Open-Meteo
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        const current = weatherData.current_weather;

        // Map Weather Code ke Icon & Text
        const getCondition = (code) => {
          if (code === 0) return { text: "Cerah Sekali", icon: "bi-sun-fill text-warning" };
          if (code <= 3) return { text: "Cerah Berawan", icon: "bi-cloud-sun text-warning" };
          if (code <= 48) return { text: "Berkabut", icon: "bi-cloud-haze2" };
          if (code <= 67) return { text: "Hujan Ringan", icon: "bi-cloud-drizzle" };
          if (code <= 82) return { text: "Hujan Deras", icon: "bi-cloud-rain-heavy-fill" };
          return { text: "Badai Petir", icon: "bi-cloud-lightning-rain-fill" };
        };

        const cond = getCondition(current.weathercode);

        setWeather({
          temp: Math.round(current.temperature),
          condition: cond.text,
          city: city,
          icon: cond.icon
        });

      } catch (err) {
        console.error("Weather error:", err);
        setWeather(prev => ({ ...prev, city: "Server Error", condition: "Gagal Update" }));
      }
    }, (error) => {
      setWeather(prev => ({ ...prev, city: "Izin Ditolak", condition: "Aktifkan GPS" }));
    });
  };

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const { data: unitData, error: unitError } = await supabase.from('units').select('status');
      if (unitError) throw unitError;

      const readyCount = unitData.filter(u => u.status === 'Ready').length;
      const breakdownCount = unitData.filter(u => u.status === 'Breakdown').length;
      const maintenanceCount = unitData.filter(u => u.status === 'Maintenance').length;

      // 2. Fetch Latest Activities (HANYA HARI INI)
      const today = new Date().toISOString().split('T')[0];
      const { data: actData, error: actError } = await supabase
        .from('activities')
        .select(`
          *,
          units (model, type),
          mechanics (name),
          locations (name)
        `)
        .gte('created_at', `${today}T00:00:00Z`) // Filter Hari Ini
        .order('created_at', { ascending: false });

      if (actError) throw actError;

      // 3. Today's Activity Count
      const todayCount = actData?.length || 0;

      setStats({
        ready: readyCount,
        down: breakdownCount,
        maintenance: maintenanceCount,
        activityToday: todayCount || 0
      });

      setActivities(actData || []);

    } catch (err) {
      console.error("Gagal memuat dashboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchFilter = filter === "Semua" || act.status === filter;
      const matchSearch = (act.units?.model || "").toLowerCase().includes(search.toLowerCase()) || 
                          (act.mechanics?.name || "").toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [activities, filter, search]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredActivities, currentPage]);

  const openDetail = async (act) => {
    setSelectedActivity(act);
    const bootstrap = await import("bootstrap");
    const modalElement = document.getElementById('activityModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const openZoom = async (img) => {
    setZoomedImg(img);
    const bootstrap = await import("bootstrap");
    const modalElement = document.getElementById('zoomModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Breakdown': return 'bg-danger';
      case 'Proses': return 'bg-warning text-dark';
      case 'Selesai': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <main className="py-4">
      <div className="container-fluid px-4 px-lg-5">
        <div className="row align-items-center mb-4 g-3">
          <div className="col-lg-6">
            <h4 className="fw-bold mb-0 text-dark">Dashboard Overview</h4>
            <p className="text-muted small mb-0">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Site Banjarbaru</p>
          </div>
          <div className="col-lg-6">
            <div className="d-flex align-items-center justify-content-lg-end gap-3 ms-lg-auto" style={{ maxWidth: '600px' }}>
              <div className="d-flex align-items-center gap-2 bg-white border px-3 py-2 rounded-pill shadow-sm">
                <div className="spinner-grow spinner-grow-sm text-primary" role="status" style={{ width: '10px', height: '10px' }}></div>
                <span className="text-xs fw-bold text-muted" style={{ whiteSpace: 'nowrap' }}>Auto-Sync: <span className="text-primary">{countdown}s</span></span>
              </div>
              <button 
                onClick={handleManualRefresh}
                className="btn btn-white border-0 shadow-sm rounded-circle p-2 hover-rotate"
                title="Refresh Manual"
                disabled={loading}
              >
                <i className={`bi bi-arrow-clockwise fs-5 ${loading ? 'spin-anim' : ''}`}></i>
              </button>
              <div className="search-box flex-grow-1">
                <i className="bi bi-search text-muted"></i>
                <input 
                  type="text" 
                  className="form-control rounded-pill border-0 shadow-sm" 
                  placeholder="Cari Unit atau Mekanik..." 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          {/* Weather Card - SEKARANG REALTIME! */}
          <div className="col-lg-4">
            <div className="card card-custom p-4 text-white animate-fade-up" style={{ background: 'var(--primary-gradient)', height: '100%' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge glass-btn rounded-pill px-3 py-2">
                  <i className="bi bi-geo-alt-fill me-1"></i> {weather.city}
                </span>
                <i className={`bi ${weather.icon.split(' ')[0]} fs-2 ${weather.icon.split(' ')[1] || ''}`}></i>
              </div>
              <div className="d-flex align-items-baseline gap-2 mt-auto">
                <h1 className="fw-800 mb-0" style={{ fontSize: '3rem' }}>{weather.temp}°C</h1>
                <span className="opacity-75">{weather.condition}</span>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="row g-4 h-100">
              <div className="col-4">
                <div className="card card-custom p-4 border-0 bg-white h-100 animate-fade-up delay-1">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="p-2 bg-success bg-opacity-10 rounded-3 text-success">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <span className="text-muted text-xs fw-600 text-uppercase">Unit Ready</span>
                  </div>
                  <h2 className="fw-bold mb-1">{loading ? '...' : stats.ready}</h2>
                  <span className="text-success text-xs fw-bold"><i className="bi bi-shield-check"></i> Operasional Aman</span>
                </div>
              </div>
              <div className="col-4">
                <div className="card card-custom p-4 border-0 bg-white h-100 animate-fade-up delay-2">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="p-2 bg-danger bg-opacity-10 rounded-3 text-danger">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <span className="text-muted text-xs fw-600 text-uppercase">Unit Down</span>
                  </div>
                  <h2 className="fw-bold mb-1">{loading ? '...' : stats.down}</h2>
                  <span className="text-danger text-xs fw-bold"><i className="bi bi-tools"></i> Butuh Perbaikan</span>
                </div>
              </div>
              <div className="col-4">
                <div className="card card-custom p-4 border-0 bg-white h-100 animate-fade-up delay-3">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
                      <i className="bi bi-calendar-event-fill"></i>
                    </div>
                    <span className="text-muted text-xs fw-600 text-uppercase">Activity Today</span>
                  </div>
                  <h2 className="fw-bold mb-1">{loading ? '...' : stats.activityToday}</h2>
                  <span className="text-primary text-xs fw-bold"><i className="bi bi-graph-up"></i> Laporan Masuk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card card-custom p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="fw-bold mb-0">Aktivitas Terbaru</h5>
                  {loading && <div className="spinner-border spinner-border-sm text-primary"></div>}
                </div>
                <div className="d-flex gap-2 overflow-auto pb-1" style={{ whiteSpace: 'nowrap' }}>
                  {["Semua", "Breakdown", "Proses", "Selesai"].map((f) => (
                    <div 
                      key={f}
                      className={`filter-pill ${filter === f ? 'active' : ''}`}
                      onClick={() => { setFilter(f); setCurrentPage(1); }}
                    >
                      {f !== "Semua" && <span className={`status-dot me-1 ${f === 'Breakdown' ? 'bg-danger' : f === 'Proses' ? 'bg-warning' : 'bg-success'}`}></span>}
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                {!loading && paginatedActivities.length > 0 ? paginatedActivities.map((act) => (
                  <div 
                    key={act.id}
                    className="p-3 border rounded-4 bg-white shadow-sm transition hover-shadow cursor-pointer border-0 animate-fade-up"
                    onClick={() => openDetail(act)}
                  >
                    <div className="row align-items-center g-3">
                      <div className="col-auto">
                        <div className="position-relative">
                          {act.image_urls && act.image_urls.length > 0 ? (
                            <img src={act.image_urls[0]} className="report-img" alt="unit" />
                          ) : (
                            <div className={`${act.status === 'Breakdown' ? 'bg-danger' : 'bg-secondary'} bg-opacity-10 text-${act.status === 'Breakdown' ? 'danger' : 'secondary'} rounded-4 d-flex align-items-center justify-content-center report-img`}>
                              <i className="bi bi-truck fs-2"></i>
                            </div>
                          )}
                          <span className={`position-absolute top-0 start-0 translate-middle p-2 border border-light rounded-circle ms-2 mt-2 ${act.status === 'Breakdown' ? 'bg-danger pulse-danger' : act.status === 'Proses' ? 'bg-warning pulse-warning' : 'bg-success'}`}></span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="mb-0 fw-bold">
                            {act.units?.model} 
                            <span className={`badge ${getStatusColor(act.status)} ms-2 rounded-pill fw-600`}>
                              {act.status}
                            </span>
                          </h6>
                          <span className="text-xs text-muted fw-bold"><i className="bi bi-clock me-1"></i>{formatTime(act.created_at)}</span>
                        </div>
                        <p className="text-muted text-sm mb-2 text-truncate" style={{ fontSize: '0.9rem', maxWidth: '90%' }}>{act.description}</p>
                        <div className="d-flex align-items-center gap-3 text-xs text-secondary fw-bold">
                          <span className="d-flex align-items-center"><i className="bi bi-person-circle me-1"></i> {act.mechanics?.name?.split(' ')[0]}</span>
                          <span className="d-flex align-items-center"><i className="bi bi-geo-alt me-1"></i> {act.locations?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : !loading && (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-clipboard-x fs-1 d-block mb-2"></i>
                    Belum ada aktivitas yang tercatat.
                  </div>
                )}
              </div>

              {/* Dashboard Pagination UI */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <span className="text-muted text-xs fw-bold">Halaman {currentPage} dari {totalPages}</span>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link border-0 rounded-circle mx-1" onClick={() => setCurrentPage(p => p - 1)}>
                          <i className="bi bi-chevron-left text-xs"></i>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i+1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                          <button className="page-link border-0 rounded-circle mx-1 text-xs fw-bold" onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link border-0 rounded-circle mx-1" onClick={() => setCurrentPage(p => p + 1)}>
                          <i className="bi bi-chevron-right text-xs"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <div className="modal fade" id="activityModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">{selectedActivity?.units?.model} Detail</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className={`badge rounded-pill ${getStatusColor(selectedActivity?.status)}`}>{selectedActivity?.status}</span>
                  <span className="text-muted text-sm ms-2"><i className="bi bi-clock me-1"></i>{selectedActivity ? formatTime(selectedActivity.created_at) : ''}</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-4 mb-4 text-sm text-secondary fw-bold bg-light p-3 rounded-3">
                <span><i className="bi bi-person-circle me-1 fs-5 align-middle"></i> {selectedActivity?.mechanics?.name}</span>
                <span><i className="bi bi-geo-alt me-1 fs-5 align-middle"></i> {selectedActivity?.locations?.name}</span>
              </div>

              <h6 className="fw-bold mb-2">Deskripsi Laporan</h6>
              <p className="text-secondary text-sm mb-4" style={{ lineHeight: '1.6' }}>{selectedActivity?.description}</p>

              {selectedActivity?.image_urls && selectedActivity.image_urls.length > 0 ? (
                <>
                  <h6 className="fw-bold mb-3">Lampiran Foto</h6>
                  <div className="row g-2">
                    {selectedActivity.image_urls.map((img, idx) => (
                      <div key={idx} className="col-md-4">
                        <img 
                          src={img} 
                          className="w-100 rounded-3 cursor-pointer transition hover-shadow" 
                          alt={`Foto-${idx}`} 
                          onClick={() => openZoom(img)}
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-light p-4 rounded-3 text-center mb-4">
                  <p className="text-muted text-sm mb-0 fst-italic">Tidak ada foto lampiran.</p>
                </div>
              )}
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <div className="modal fade" id="zoomModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content" style={{ background: 'transparent', border: 'none' }}>
            <div className="modal-header border-0 pb-0">
              <button type="button" className="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close" style={{ filter: 'invert(1)' }}></button>
            </div>
            <div className="modal-body text-center p-0">
              {zoomedImg && <img src={zoomedImg} className="zoom-img shadow-lg" alt="zoomed" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '15px' }} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
