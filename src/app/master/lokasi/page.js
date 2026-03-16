"use client"

import { useState, useMemo, useEffect } from "react";
import { lokasiService } from "../../../services/lokasiService";
import LokasiModal from "./LokasiModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/dashboard.css";
import "../../../styles/master.css";

const MySwal = withReactContent(Swal);

export default function LokasiMaster() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const itemsPerPage = 5;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Active",
    description: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await lokasiService.getAll();
      setLocations(data);
    } catch (err) {
      console.error("Gagal memuat data:", err.message);
      MySwal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: err.message,
        customClass: { popup: 'swal2-popup-custom', title: 'swal2-title-custom', confirmButton: 'swal2-confirm-btn-custom' },
        buttonsStyling: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = async () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: "", type: "", status: "Active", description: "" });
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('lokasiModal'));
    modal.show();
  };

  const openEditModal = async (loc) => {
    setIsEditing(true);
    setEditId(loc.id);
    setFormData({
      name: loc.name,
      type: loc.type,
      status: loc.status,
      description: loc.description || ""
    });
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('lokasiModal'));
    modal.show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await lokasiService.update(editId, formData);
      } else {
        await lokasiService.create(formData);
      }

      const bootstrap = await import("bootstrap");
      const modalElement = document.getElementById('lokasiModal');
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
      
      fetchLocations();

      MySwal.fire({
        icon: 'success',
        title: isEditing ? 'Berhasil Diperbarui!' : 'Berhasil Ditambahkan!',
        text: `Lokasi ${formData.name} telah berhasil disimpan.`,
        showConfirmButton: false,
        timer: 2500,
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        customClass: { popup: 'swal2-toast-custom', title: 'swal2-title-custom' }
      });

    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: err.message,
        customClass: { popup: 'swal2-popup-custom', title: 'swal2-title-custom', confirmButton: 'swal2-confirm-btn-custom' },
        buttonsStyling: false
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await MySwal.fire({
      title: 'Hapus Lokasi?',
      text: `${name} (#${id}) akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: { popup: 'swal2-popup-custom', title: 'swal2-title-custom', confirmButton: 'swal2-confirm-btn-custom', cancelButton: 'swal2-cancel-btn-custom' },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await lokasiService.delete(id);
        fetchLocations();
        MySwal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data lokasi telah dihapus.',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: 'top-end',
          customClass: { popup: 'swal2-toast-custom', title: 'swal2-title-custom' }
        });
      } catch (err) {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
          customClass: { popup: 'swal2-popup-custom', title: 'swal2-title-custom', confirmButton: 'swal2-confirm-btn-custom' },
          buttonsStyling: false
        });
      }
    }
  };

  const filteredLocations = useMemo(() => {
    return locations.filter(l => 
      l.name.toLowerCase().includes(search.toLowerCase()) || 
      l.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [locations, search]);

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const paginatedLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLocations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLocations, currentPage]);

  return (
    <main className="py-4">
      <div className="container-fluid px-4 px-lg-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Data Lokasi Pit & Site</h4>
            <p className="text-muted small mb-0">Manajemen Area Penambangan</p>
          </div>
          <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={openAddModal}>
            <i className="bi bi-plus-lg"></i>
            <span>Tambah Lokasi</span>
          </button>
        </div>

        <div className="row mb-4 g-3">
          <div className="col-md-8 col-lg-6">
            <div className="search-box">
              <i className="bi bi-search text-muted"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari Nama atau Tipe Lokasi..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
        </div>

        <div className="table-custom-container animate-fade-up">
          <div className="table-responsive">
            <table className="table table-custom table-borderless mb-0">
              <thead>
                <tr>
                  <th>No / ID</th>
                  <th>Nama Lokasi</th>
                  <th>Tipe Area</th>
                  <th>Keterangan</th>
                  <th>Status</th>
                  <th className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary spinner-border-sm" role="status"></div></td></tr>
                ) : paginatedLocations.length > 0 ? paginatedLocations.map((loc) => (
                  <tr key={loc.id}>
                    <td className="fw-bold text-primary">#{loc.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="p-2 bg-danger bg-opacity-10 text-danger rounded-3 me-3">
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <span className="fw-bold">{loc.name}</span>
                      </div>
                    </td>
                    <td><span className="badge bg-light text-dark rounded-pill fw-600 px-3">{loc.type}</span></td>
                    <td className="text-muted small" style={{ maxWidth: '250px' }}>{loc.description || '-'}</td>
                    <td>
                      <span className="d-flex align-items-center gap-2">
                        <span className={`status-dot ${loc.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}></span>
                        <span className={`fw-bold ${loc.status === 'Active' ? 'text-success' : 'text-secondary'}`} style={{ fontSize: '0.8rem' }}>{loc.status}</span>
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="action-btn edit" title="Edit" onClick={() => openEditModal(loc)}><i className="bi bi-pencil-square"></i></button>
                      <button className="action-btn delete" title="Hapus" onClick={() => handleDelete(loc.id, loc.name)}><i className="bi bi-trash3-fill"></i></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Tidak ada data lokasi.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-3 border-top gap-3">
              <p className="text-muted small mb-0">Halaman {currentPage} dari {totalPages}</p>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link border-0 rounded-circle mx-1" onClick={() => setCurrentPage(p => p - 1)}><i className="bi bi-chevron-left"></i></button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i+1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link border-0 rounded-circle mx-1" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link border-0 rounded-circle mx-1" onClick={() => setCurrentPage(p => p + 1)}><i className="bi bi-chevron-right"></i></button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      <LokasiModal 
        isEditing={isEditing}
        editId={editId}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
      />
    </main>
  );
}
