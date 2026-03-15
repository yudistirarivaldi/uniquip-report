"use client"

import { useState, useMemo } from "react";
import "../../../styles/dashboard.css";
import "../../../styles/master.css";

export default function UnitMaster() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const initialUnit = [
    { id: "EXCA-201", model: "Komatsu PC-200", type: "Excavator", status: "Ready", sn: "K200-88120X", year: "2021" },
    { id: "TRK-052", model: "Scania P360", type: "Dump Truck", status: "Breakdown", sn: "S360-11223Y", year: "2022" },
    { id: "DOZ-105", model: "CAT D10T", type: "Bulldozer", status: "Ready", sn: "C10T-55442Z", year: "2019" },
    { id: "LV-012", model: "Toyota Hilux", type: "Light Vehicle", status: "Maintenance", sn: "TH-099281W", year: "2023" },
    { id: "EXCA-202", model: "Komatsu PC-200", type: "Excavator", status: "Ready", sn: "K200-88121X", year: "2021" },
    { id: "TRK-053", model: "Scania P360", type: "Dump Truck", status: "Ready", sn: "S360-11224Y", year: "2022" },
    { id: "DOZ-106", model: "CAT D10T", type: "Bulldozer", status: "Breakdown", sn: "C10T-55443Z", year: "2019" },
  ];

  const [units, setUnits] = useState(initialUnit);

  // Search & Pagination Logic
  const filteredUnits = useMemo(() => {
    return units.filter(u => 
      u.id.toLowerCase().includes(search.toLowerCase()) || 
      u.model.toLowerCase().includes(search.toLowerCase()) ||
      u.sn.toLowerCase().includes(search.toLowerCase()) ||
      u.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [units, search]);

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUnits.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUnits, currentPage]);

  const openAddModal = async () => {
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('addUnitModal'));
    modal.show();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ready': return 'bg-success bg-opacity-10 text-success';
      case 'Breakdown': return 'bg-danger bg-opacity-10 text-danger';
      case 'Maintenance': return 'bg-warning bg-opacity-10 text-dark';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  const getUnitIcon = (type) => {
    switch (type) {
      case 'Excavator': return 'bi-hammer';
      case 'Dump Truck': return 'bi-truck';
      case 'Bulldozer': return 'bi-minecart-loaded';
      case 'Light Vehicle': return 'bi-car-front-fill';
      default: return 'bi-gear-wide-connected';
    }
  };

  return (
    <main className="py-4">
      <div className="container-fluid px-4 px-lg-5">
        
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Data Unit / Alat Berat</h4>
            <p className="text-muted small mb-0">Kelola master armada dan spesifikasi teknis unit</p>
          </div>
          <button 
            className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
            onClick={openAddModal}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Tambah Unit Baru</span>
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
                placeholder="Cari ID Unit, Model, atau Serial Number..." 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-6 d-flex justify-content-md-end gap-2">
            <button className="btn btn-white border rounded-pill px-3 fw-600 text-muted shadow-sm bg-white">
              <i className="bi bi-download me-2"></i>Export Excel
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-custom-container animate-fade-up">
          <div className="table-responsive">
            <table className="table table-custom table-borderless mb-0">
              <thead>
                <tr>
                  <th>ID Unit</th>
                  <th>Model / Tipe</th>
                  <th>Serial Number</th>
                  <th>Manufacturing</th>
                  <th>Status Unit</th>
                  <th className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUnits.length > 0 ? paginatedUnits.map((u) => (
                  <tr key={u.id}>
                    <td className="fw-bold text-primary">{u.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 me-3">
                          <i className={`bi ${getUnitIcon(u.type)}`}></i>
                        </div>
                        <div>
                          <span className="fw-bold d-block">{u.model}</span>
                          <span className="text-muted text-xs">{u.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="fw-semibold font-monospace" style={{ fontSize: '0.85rem' }}>{u.sn}</td>
                    <td><span className="fw-bold text-secondary">Tahun {u.year}</span></td>
                    <td>
                      <span className={`badge rounded-pill fw-bold px-3 py-2 ${getStatusBadge(u.status)}`} style={{ fontSize: '0.75rem' }}>
                        {u.status}
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
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Tidak ada data unit yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Functional Pagination */}
          {totalPages > 0 && (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-3 border-top gap-3">
              <p className="text-muted small mb-0">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUnits.length)} dari {filteredUnits.length} unit
              </p>
              <nav aria-label="Page navigation">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link border-0 rounded-circle mx-1" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i+1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link border-0 rounded-circle mx-1" 
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link border-0 rounded-circle mx-1" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Add Unit Modal */}
      <div className="modal fade" id="addUnitModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Tambah Unit Baru</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="section-divider">
                  <span className="section-divider-text">Detail Teknis Unit</span>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">ID UNIT</label>
                    <input type="text" className="form-control form-control-custom" placeholder="Contoh: EXCA-201" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">KATEGORI UNIT</label>
                    <select className="form-select form-control-custom">
                      <option value="">Pilih Kategori</option>
                      <option value="Excavator">Excavator</option>
                      <option value="Dump Truck">Dump Truck</option>
                      <option value="Bulldozer">Bulldozer</option>
                      <option value="Grader">Grader</option>
                      <option value="Light Vehicle">Light Vehicle</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label-custom">MODEL / BRAND</label>
                    <input type="text" className="form-control form-control-custom" placeholder="Contoh: Komatsu PC-200" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">SERIAL NUMBER</label>
                    <input type="text" className="form-control form-control-custom" placeholder="Nomor Rangka/Mesin" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">TAHUN PEMBUATAN</label>
                    <input type="number" className="form-control form-control-custom" placeholder="202X" />
                  </div>
                </div>

                <div className="section-divider mt-4">
                  <span className="section-divider-text">Status Awal</span>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">STATUS OPERASIONAL</label>
                    <select className="form-select form-control-custom">
                      <option value="Ready">Ready</option>
                      <option value="Breakdown">Breakdown</option>
                      <option value="Maintenance">Scheduled Maintenance</option>
                    </select>
                  </div>
                  <div className="col-md-6 d-flex align-items-end">
                    <div className="alert alert-info bg-info bg-opacity-10 border-0 rounded-4 p-2 mb-0 w-100">
                      <p className="mb-0 small text-info-emphasis fw-600"><i className="bi bi-info-circle me-1"></i> Unit baru akan terdaftar di sistem pusat.</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold">Daftarkan Unit</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
