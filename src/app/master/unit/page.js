"use client"

import { useState, useMemo, useEffect } from "react";
import { unitService } from "../../../services/unitService";
import UnitModal from "./UnitModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/dashboard.css";
import "../../../styles/master.css";

const MySwal = withReactContent(Swal);

export default function UnitMaster() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [units, setUnits] = useState([]);
  const itemsPerPage = 5;

  // Form State
  const [formData, setFormData] = useState({
    model: "",
    type: "",
    sn: "",
    year: "",
    status: "Ready"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const data = await unitService.getAll();
      setUnits(data);
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
    setFormData({ model: "", type: "", sn: "", year: "", status: "Ready" });
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('unitModal'));
    modal.show();
  };

  const openEditModal = async (unit) => {
    setIsEditing(true);
    setEditId(unit.id);
    setFormData({
      model: unit.model,
      type: unit.type,
      sn: unit.sn,
      year: unit.year,
      status: unit.status
    });
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('unitModal'));
    modal.show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await unitService.update(editId, formData);
      } else {
        await unitService.create(formData);
      }

      const bootstrap = await import("bootstrap");
      const modalElement = document.getElementById('unitModal');
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
      
      fetchUnits();

      MySwal.fire({
        icon: 'success',
        title: isEditing ? 'Berhasil Diperbarui!' : 'Berhasil Ditambahkan!',
        text: `Unit ${formData.model} telah berhasil disimpan.`,
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

  const handleDelete = async (id, model) => {
    const result = await MySwal.fire({
      title: 'Hapus Unit Armada?',
      html: `Anda akan menghapus <b>${model}</b> (#${id}) secara permanen.<br/><small class="text-danger mt-2 d-block">Tindakan ini tidak dapat dibatalkan!</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus Sekarang',
      cancelButtonText: 'Batalkan',
      reverseButtons: true,
      customClass: { popup: 'swal2-popup-custom', title: 'swal2-title-custom', confirmButton: 'swal2-confirm-btn-custom', cancelButton: 'swal2-cancel-btn-custom', htmlContainer: 'swal2-html-custom' },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await unitService.delete(id);
        fetchUnits();
        MySwal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data unit telah berhasil dihapus.',
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

  const filteredUnits = useMemo(() => {
    return units.filter(u => 
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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Master Data Unit</h4>
            <p className="text-muted small mb-0">Kelola armada dengan sistem konfirmasi premium</p>
          </div>
          <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={openAddModal}>
            <i className="bi bi-plus-lg"></i>
            <span>Tambah Unit Baru</span>
          </button>
        </div>

        <div className="row mb-4 g-3">
          <div className="col-md-8 col-lg-6">
            <div className="search-box">
              <i className="bi bi-search text-muted"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari Model, Tipe, atau Serial Number..." 
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
                  <th>Model / Tipe</th>
                  <th>Serial Number</th>
                  <th>Manufacturing</th>
                  <th>Status Unit</th>
                  <th className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary spinner-border-sm" role="status"></div></td></tr>
                ) : paginatedUnits.length > 0 ? paginatedUnits.map((u) => (
                  <tr key={u.id}>
                    <td className="fw-bold text-primary">#{u.id}</td>
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
                    <td><span className="fw-bold text-secondary">Th {u.year}</span></td>
                    <td>
                      <span className={`badge rounded-pill fw-bold px-3 py-2 ${getStatusBadge(u.status)}`} style={{ fontSize: '0.75rem' }}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="action-btn edit" title="Edit" onClick={() => openEditModal(u)}><i className="bi bi-pencil-square"></i></button>
                      <button className="action-btn delete" title="Hapus" onClick={() => handleDelete(u.id, u.model)}><i className="bi bi-trash3-fill"></i></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Tidak ada data.</td></tr>
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

      <UnitModal 
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
