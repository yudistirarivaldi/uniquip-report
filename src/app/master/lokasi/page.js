"use client"

import { useState } from "react";
import "../../../styles/dashboard.css";
import "../../../styles/master.css";

export default function LokasiMaster() {
  const [search, setSearch] = useState("");
  
  const initialLokasi = [
    { id: "LOC-01", name: "Pit Alpha", type: "Pit Mining", status: "Active", desc: "Area penambangan utama blok utara" },
    { id: "LOC-02", name: "Pit Bravo", type: "Pit Mining", status: "Active", desc: "Area penambangan blok selatan" },
    { id: "LOC-03", name: "Workshop Utama", type: "Workshop", status: "Active", desc: "Pusat perbaikan dan maintenance berat" },
    { id: "LOC-04", name: "Site Banjarbaru", type: "Office & Camp", status: "Active", desc: "Kantor pusat operasional dan mess karyawan" },
  ];

  const [locations, setLocations] = useState(initialLokasi);

  const openAddModal = async () => {
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('addLokasiModal'));
    modal.show();
  };

  return (
    <main className="py-4">
      <div className="container-fluid px-4 px-lg-5">
        
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Data Lokasi Pit & Site</h4>
            <p className="text-muted small mb-0">Kelola master area penambangan dan workshop operasional</p>
          </div>
          <button 
            className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
            onClick={openAddModal}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Tambah Lokasi</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="row mb-4 g-3">
          <div className="col-md-8 col-lg-6">
            <div className="search-box">
              <i className="bi bi-search text-muted"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari ID atau Nama Lokasi..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-md-end gap-2">
            <button className="btn btn-white border rounded-pill px-3 fw-600 text-muted shadow-sm bg-white">
              <i className="bi bi-download me-2"></i>Export CSV
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-custom-container animate-fade-up">
          <div className="table-responsive">
            <table className="table table-custom table-borderless mb-0">
              <thead>
                <tr>
                  <th>ID Lokasi</th>
                  <th>Nama Lokasi</th>
                  <th>Tipe Area</th>
                  <th>Keterangan</th>
                  <th>Status</th>
                  <th className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).map((loc) => (
                  <tr key={loc.id}>
                    <td className="fw-bold text-primary">{loc.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="p-2 bg-danger bg-opacity-10 text-danger rounded-3 me-3">
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <span className="fw-bold">{loc.name}</span>
                      </div>
                    </td>
                    <td><span className="badge bg-light text-dark rounded-pill fw-600 px-3">{loc.type}</span></td>
                    <td className="text-muted small" style={{ maxWidth: '250px' }}>{loc.desc}</td>
                    <td>
                      <span className="d-flex align-items-center gap-2">
                        <span className="status-dot bg-success"></span>
                        <span className="fw-bold text-success" style={{ fontSize: '0.8rem' }}>{loc.status}</span>
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="action-btn edit" title="Edit">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="action-btn delete" title="Hapus">
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Lokasi Modal */}
      <div className="modal fade" id="addLokasiModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Tambah Lokasi Baru</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label-custom">ID LOKASI</label>
                  <input type="text" className="form-control form-control-custom" placeholder="Contoh: PIT-C1" />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">NAMA LOKASI / AREA</label>
                  <input type="text" className="form-control form-control-custom" placeholder="Contoh: Pit Charlie" />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">TIPE AREA</label>
                  <select className="form-select form-control-custom">
                    <option value="">Pilih Tipe</option>
                    <option value="Pit Mining">Pit Mining</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Office">Office & Camp</option>
                    <option value="Hauling">Hauling Road</option>
                  </select>
                </div>
                <div className="mb-0">
                  <label className="form-label-custom">KETERANGAN TAMBAHAN</label>
                  <textarea className="form-control form-control-custom" rows="3" placeholder="Jelaskan detail lokasi jika diperlukan..."></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">Simpan Lokasi</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
