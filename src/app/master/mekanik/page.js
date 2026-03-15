"use client"

import { useState } from "react";
import "../../../styles/dashboard.css";
import "../../../styles/master.css";

export default function MekanikMaster() {
  const [search, setSearch] = useState("");
  
  const initialMekanik = [
    { id: "MKN-001", name: "Budi Santoso", role: "Senior Mechanic", location: "Pit Alpha", status: "Active", email: "budi@uniquip.com" },
    { id: "MKN-002", name: "Andi Wijaya", role: "Hydraulic Specialist", location: "Workshop Utama", status: "Active", email: "andi@uniquip.com" },
    { id: "MKN-003", name: "Siti Aminah", role: "Engine Specialist", location: "Pit Bravo", status: "Active", email: "siti@uniquip.com" },
    { id: "MKN-004", name: "Rahmat Hidayat", role: "General Mechanic", location: "Site Banjarbaru", status: "Active", email: "rahmat@uniquip.com" },
  ];

  const [mekaniks, setMekaniks] = useState(initialMekanik);

  const openAddModal = async () => {
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('addMekanikModal'));
    modal.show();
  };

  return (
    <main className="py-4">
      <div className="container-fluid px-4 px-lg-5">
        
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Data Mekanik</h4>
            <p className="text-muted small mb-0">Kelola informasi mekanik dan akun operasional</p>
          </div>
          <button 
            className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
            onClick={openAddModal}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Tambah Mekanik</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="row mb-4 g-3">
          <div className="col-md-8 col-lg-6">
            <div className="search-box">
              <i className="bi bi-search text-muted"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari ID, Nama, atau Lokasi Mekanik..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-md-end gap-2">
            <button className="btn btn-white border rounded-pill px-3 fw-600 text-muted shadow-sm bg-white">
              <i className="bi bi-download me-2"></i>Export
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-custom-container animate-fade-up">
          <div className="table-responsive">
            <table className="table table-custom table-borderless mb-0">
              <thead>
                <tr>
                  <th>ID Mekanik</th>
                  <th>Nama Lengkap</th>
                  <th>Spesialisasi</th>
                  <th>Lokasi / Site</th>
                  <th>Status Akun</th>
                  <th className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mekaniks.map((m, idx) => (
                  <tr key={m.id}>
                    <td className="fw-bold text-primary">{m.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-initials bg-primary bg-opacity-10 text-primary me-3">
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="mb-0 fw-bold">{m.name}</p>
                          <p className="mb-0 text-muted text-xs">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-light text-dark rounded-pill fw-600 px-3">{m.role}</span></td>
                    <td>
                      <p className="mb-0 fw-semibold"><i className="bi bi-geo-alt-fill text-danger me-1"></i> {m.location}</p>
                    </td>
                    <td>
                      <span className="d-flex align-items-center gap-2">
                        <span className="status-dot bg-success"></span>
                        <span className="fw-bold text-success" style={{ fontSize: '0.8rem' }}>{m.status}</span>
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="action-btn edit" title="Edit Data">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="action-btn delete" title="Hapus Data">
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-3 border-top gap-3">
            <p className="text-muted small mb-0">Menampilkan 1-10 dari 42 mekanik</p>
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled"><a className="page-link border-0 rounded-circle mx-1" href="#"><i className="bi bi-chevron-left"></i></a></li>
                <li className="page-item active"><a className="page-link border-0 rounded-circle mx-1" href="#">1</a></li>
                <li className="page-item"><a className="page-link border-0 rounded-circle mx-1" href="#">2</a></li>
                <li className="page-item"><a className="page-link border-0 rounded-circle mx-1" href="#">3</a></li>
                <li className="page-item"><a className="page-link border-0 rounded-circle mx-1" href="#"><i className="bi bi-chevron-right"></i></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Add Mekanik Modal */}
      <div className="modal fade" id="addMekanikModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Tambah Mekanik Baru</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                {/* Personal Information Section */}
                <div className="section-divider">
                  <span className="section-divider-text">Informasi Personel</span>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">ID MEKANIK</label>
                    <input type="text" className="form-control form-control-custom" placeholder="Contoh: MKN-042" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">NAMA LENGKAP</label>
                    <input type="text" className="form-control form-control-custom" placeholder="Contoh: Yudistira Rivaldi" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">SPESIALISASI / JABATAN</label>
                    <select className="form-select form-control-custom">
                      <option value="">Pilih Spesialisasi</option>
                      <option value="Senior">Senior Mechanic</option>
                      <option value="Hydraulic">Hydraulic Specialist</option>
                      <option value="Engine">Engine Specialist</option>
                      <option value="General">General Mechanic</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">PENEMPATAN LOKASI</label>
                    <select className="form-select form-control-custom">
                      <option value="">Pilih Lokasi</option>
                      <option value="Banjarbaru">Site Banjarbaru</option>
                      <option value="Alpha">Pit Alpha</option>
                      <option value="Bravo">Pit Bravo</option>
                      <option value="Workshop">Workshop Utama</option>
                    </select>
                  </div>
                </div>

                {/* Account Section */}
                <div className="section-divider mt-5">
                  <span className="section-divider-text">Detail Akun Operasional</span>
                </div>

                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label-custom">EMAIL / USERNAME</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-4"><i className="bi bi-envelope"></i></span>
                      <input type="email" className="form-control form-control-custom rounded-start-0" placeholder="Contoh: yudis@uniquip.com" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">PASSWORD</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-4"><i className="bi bi-lock"></i></span>
                      <input type="password" className="form-control form-control-custom rounded-start-0" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">KONFIRMASI PASSWORD</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-4"><i className="bi bi-shield-check"></i></span>
                      <input type="password" className="form-control form-control-custom rounded-start-0" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <div className="alert alert-primary bg-primary bg-opacity-10 border-0 rounded-4 mt-4 p-3 d-flex gap-3 align-items-center">
                  <i className="bi bi-info-circle-fill fs-4 text-primary"></i>
                  <p className="mb-0 small text-primary-emphasis fw-semibold">Akun yang dibuat akan langsung aktif dan mekanik dapat login menggunakan ID Mekanik atau Email yang didaftarkan.</p>
                </div>
              </form>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">Simpan & Buat Akun</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
