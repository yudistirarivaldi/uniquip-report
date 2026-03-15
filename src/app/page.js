"use client"

import { useState } from "react";
import "../styles/dashboard.css";

export default function Home() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [zoomedImg, setZoomedImg] = useState(null);
  const [filter, setFilter] = useState("Semua");

  const activities = [
    {
      id: 1,
      title: "Excavator PC-200",
      status: "Proses",
      statusBg: "bg-warning text-dark",
      time: "14:30 WITA",
      mechanic: "Budi Santoso",
      location: "Pit Alpha",
      desc: "Check kebocoran silinder bucket hidrolik. Sedang menunggu seal kit dari gudang. Setelah barang tiba akan langsung dipasang dan dilakukan pengujian tekanan hidrolik agar unit bisa beroperasi kembali tanpa kendala lanjutan.",
      images: [
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
        "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=800",
        "https://images.unsplash.com/photo-1581091870621-0a149c3b8852?w=800"
      ]
    },
    {
      id: 2,
      title: "Dump Truck DT-05",
      status: "Breakdown",
      statusBg: "bg-danger",
      time: "13:15 WITA",
      mechanic: "Yudis Rivaldi",
      location: "Jalan Hauling KM 5",
      desc: "Mesin overheat saat di tanjakan berat beban penuh. Terdapat indikasi kebocoran parah pada radiator hose bypass. Unit sudah ditarik ke workshop dan sedang menunggu proses pengelasan serta penggantian part cooling system yang rusak guna menghindari kerusakan internal engine.",
      images: [],
      icon: "bi-truck"
    },
    {
      id: 3,
      title: "Light Vehicle LV-12",
      status: "Selesai",
      statusBg: "bg-success",
      time: "10:00 WITA",
      mechanic: "Andi",
      location: "Workshop Utama",
      desc: "Perawatan berkala mencapai 10.000 KM. Melakukan ganti oli mesin, penggantian filter oli, filter udara dan filter solar. Rotasi 4 set ban dilakukan dan kalibrasi spooring. Kondisi rem masih 70% baik. Unit sudah bisa digunakan kembali untuk operasional patroli site.",
      images: [
        "https://images.unsplash.com/photo-1530047625168-4b29bf84604a?w=800",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"
      ]
    }
  ];

  const filteredActivities = activities.filter(act => 
    filter === "Semua" || act.status === filter
  );

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

  return (
    <main>
      <nav className="navbar navbar-expand-lg sticky-top py-3">
        <div className="container-fluid px-4 px-lg-5">
          <a className="navbar-brand fw-800 text-primary" href="#">MECHLOG.</a>
          
          <div className="d-flex align-items-center gap-3 ms-auto">
            <div className="position-relative cursor-pointer">
              <i className="bi bi-bell fs-5 text-secondary"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </div>
            
            <div className="dropdown">
              <a href="#" className="d-flex align-items-center text-decoration-none text-dark" data-bs-toggle="dropdown">
                <img src={`https://ui-avatars.com/api/?name=Yudistira+Rivaldi&background=2563eb&color=fff`} className="rounded-circle shadow-sm" width="38" alt="avatar" />
                <div className="ms-2 d-none d-md-block lh-1">
                  <span className="fw-bold d-block" style={{ fontSize: '0.9rem' }}>Yudis Rivaldi</span>
                  <span className="text-muted text-xs">Senior Mechanic</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4 px-lg-5 mt-4 mb-5">
        <div className="row align-items-center mb-4 g-3">
          <div className="col-lg-6">
            <h4 className="fw-bold mb-0">Selamat Siang, Yudis! 👋</h4>
            <p className="text-muted small mb-0">Minggu, 15 Maret 2026 • Shift Siang</p>
          </div>
          <div className="col-lg-6">
            <div className="search-box ms-lg-auto" style={{ maxWidth: '400px' }}>
              <i className="bi bi-search text-muted"></i>
              <input type="text" className="form-control" placeholder="Cari ID Unit, Laporan, atau Kendala..." />
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-4 order-2 order-lg-1">
            <div className="card card-custom p-4 mb-4 text-white animate-fade-up delay-1" style={{ background: 'var(--primary-gradient)' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge glass-btn rounded-pill px-3 py-2"><i className="bi bi-geo-alt-fill me-1"></i>Site Banjarbaru</span>
                <i className="bi bi-cloud-sun fs-2 text-warning"></i>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <h1 className="fw-800 mb-0" style={{ fontSize: '3rem' }}>31°C</h1>
                <span className="opacity-75">Cerah Berawan</span>
              </div>
            </div>

            <div className="row g-3 mb-4 animate-fade-up delay-2">
              <div className="col-6">
                <div className="card card-custom p-3 border-0 bg-white">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="p-2 bg-success bg-opacity-10 rounded-3 text-success">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <span className="text-muted text-xs fw-600 text-uppercase">Ready</span>
                  </div>
                  <h3 className="fw-bold mb-1">42</h3>
                  <span className="text-success text-xs fw-bold"><i className="bi bi-arrow-up"></i> 2 unit</span>
                </div>
              </div>
              <div className="col-6">
                <div className="card card-custom p-3 border-0 bg-white">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="p-2 bg-danger bg-opacity-10 rounded-3 text-danger">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <span className="text-muted text-xs fw-600 text-uppercase">Down</span>
                  </div>
                  <h3 className="fw-bold mb-1">3</h3>
                  <span className="text-danger text-xs fw-bold"><i className="bi bi-dash-circle"></i> Stabil</span>
                </div>
              </div>
            </div>

            <div className="card card-custom p-4 animate-fade-up delay-3">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="fw-bold mb-0"><i className="bi bi-lightning-charge-fill text-warning me-2"></i>Lapor Cepat</h6>
                <span className="text-xs text-muted">ID: #REP-0315</span>
              </div>
              <form>
                <div className="mb-3">
                  <label className="text-xs fw-bold text-muted mb-1 d-block">PENANDA UNIT</label>
                  <input type="text" className="form-control border-0 bg-light py-2 rounded-3" placeholder="Contoh: TRK-09" />
                </div>
                <div className="mb-3">
                  <label className="text-xs fw-bold text-muted mb-1 d-block">DETAIL KELUHAN</label>
                  <textarea className="form-control border-0 bg-light py-2 rounded-3" rows={3} placeholder="Apa kendala unit ini?"></textarea>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <label className="btn btn-outline-light text-dark border-0 bg-light btn-sm rounded-pill px-3 transition">
                    <i className="bi bi-camera-fill me-1"></i> Foto
                    <input type="file" className="d-none" />
                  </label>
                  <button type="button" className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold transition">Kirim Laporan</button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-8 order-1 order-lg-2">
            <div className="card card-custom p-4 h-100">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h5 className="fw-bold mb-0">Aktivitas Hari Ini</h5>
                <div className="d-flex gap-2 overflow-auto pb-1" style={{ whiteSpace: 'nowrap' }}>
                  {["Semua", "Breakdown", "Proses", "Selesai"].map((f) => (
                    <div 
                      key={f}
                      className={`filter-pill ${filter === f ? 'active' : ''}`}
                      onClick={() => setFilter(f)}
                    >
                      {f !== "Semua" && <span className={`status-dot me-1 ${f === 'Breakdown' ? 'bg-danger' : f === 'Proses' ? 'bg-warning' : 'bg-success'}`}></span>}
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                {filteredActivities.map((act) => (
                  <div 
                    key={act.id}
                    className="p-3 border rounded-4 bg-white shadow-sm transition hover-shadow cursor-pointer border-0 animate-fade-up"
                    onClick={() => openDetail(act)}
                  >
                    <div className="row align-items-center g-3">
                      <div className="col-auto">
                        <div className="position-relative">
                          {act.images.length > 0 ? (
                            <img src={act.images[0]} className="report-img" alt="unit" />
                          ) : (
                            <div className={`${act.status === 'Breakdown' ? 'bg-danger' : 'bg-secondary'} bg-opacity-10 text-${act.status === 'Breakdown' ? 'danger' : 'secondary'} rounded-4 d-flex align-items-center justify-content-center report-img`}>
                              <i className={`bi ${act.icon || 'bi-truck'} fs-2`}></i>
                            </div>
                          )}
                          <span className={`position-absolute top-0 start-0 translate-middle p-2 border border-light rounded-circle ms-2 mt-2 ${act.status === 'Breakdown' ? 'bg-danger pulse-danger' : act.status === 'Proses' ? 'bg-warning pulse-warning' : 'bg-success'}`}></span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="mb-0 fw-bold">{act.title} <span className={`badge ${act.statusBg} ms-2 rounded-pill fw-600`}>{act.status}</span></h6>
                          <span className="text-xs text-muted fw-bold"><i className="bi bi-clock me-1"></i>{act.time}</span>
                        </div>
                        <p className="text-muted text-sm mb-2 text-truncate" style={{ fontSize: '0.9rem', maxWidth: '90%' }}>{act.desc}</p>
                        <div className="d-flex align-items-center gap-3 text-xs text-secondary fw-bold">
                          <span className="d-flex align-items-center"><i className="bi bi-person-circle me-1"></i> {act.mechanic.split(' ')[0]}</span>
                          <span className="d-flex align-items-center"><i className="bi bi-geo-alt me-1"></i> {act.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="activityModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">{selectedActivity?.title} Detail</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className={`badge rounded-pill ${selectedActivity?.statusBg}`}>{selectedActivity?.status}</span>
                  <span className="text-muted text-sm ms-2"><i className="bi bi-clock me-1"></i>{selectedActivity?.time}</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-4 mb-4 text-sm text-secondary fw-bold bg-light p-3 rounded-3">
                <span><i className="bi bi-person-circle me-1 fs-5 align-middle"></i> {selectedActivity?.mechanic}</span>
                <span><i className="bi bi-geo-alt me-1 fs-5 align-middle"></i> {selectedActivity?.location}</span>
              </div>

              <h6 className="fw-bold mb-2">Deskripsi Masalah / Pekerjaan</h6>
              <p className="text-secondary text-sm mb-4" style={{ lineHeight: '1.6' }}>{selectedActivity?.desc}</p>

              {selectedActivity?.images && selectedActivity.images.length > 0 ? (
                <>
                  <h6 className="fw-bold mb-3">Lampiran Foto (Geser untuk lihat lainnya)</h6>
                  <div id="activityCarousel" className="carousel slide mb-4">
                    <div className="carousel-inner">
                      {selectedActivity.images.map((img, idx) => (
                        <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                          <img 
                            src={img} 
                            className="d-block w-100 modal-carousel-img" 
                            alt={`Slide ${idx}`} 
                            onClick={() => openZoom(img)} 
                            style={{ cursor: 'zoom-in' }}
                          />
                        </div>
                      ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#activityCarousel" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#activityCarousel" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
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
              <button type="button" className="btn btn-primary rounded-pill px-4">Update Status</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="zoomModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content" style={{ background: 'transparent', border: 'none' }}>
            <div className="modal-header border-0 pb-0">
              <button type="button" className="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close" style={{ filter: 'invert(1)' }}></button>
            </div>
            <div className="modal-body text-center p-0">
              {zoomedImg && <img src={zoomedImg} className="zoom-img shadow-lg" alt="zoomed" style={{ transform: 'scale(1)' }} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
