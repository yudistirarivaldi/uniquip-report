"use client"

import { useState, useMemo, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../../styles/dashboard.css";
import "../../../styles/master.css";

const MySwal = withReactContent(Swal);

export default function MekanikMaster() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mekaniks, setMekaniks] = useState([]);
  const itemsPerPage = 5;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    status: "Active",
    email: "",
    password: "",
    access_role: "mechanic" // Default role
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMekaniks();
  }, []);

  const fetchMekaniks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mechanics')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setMekaniks(data || []);
    } catch (err) {
      console.error("Gagal memuat data:", err.message);
      MySwal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: err.message,
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          htmlContainer: 'swal2-html-custom',
          confirmButton: 'swal2-confirm-btn-custom'
        },
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
    setFormData({ 
      name: "", 
      role: "", 
      location: "", 
      status: "Active", 
      email: "", 
      password: "",
      access_role: "mechanic" 
    });
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('mekanikModal'));
    modal.show();
  };

  const openEditModal = async (m) => {
    setIsEditing(true);
    setEditId(m.id);
    setFormData({
      name: m.name,
      role: m.role,
      location: m.location,
      status: m.status,
      email: m.email,
      password: m.password || "",
      access_role: m.access_role || "mechanic"
    });
    const bootstrap = await import("bootstrap");
    const modal = new bootstrap.Modal(document.getElementById('mekanikModal'));
    modal.show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('mechanics')
          .update(formData)
          .eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mechanics')
          .insert([formData]);
        if (error) throw error;
      }

      const bootstrap = await import("bootstrap");
      const modalElement = document.getElementById('mekanikModal');
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
      
      fetchMekaniks();

      MySwal.fire({
        icon: 'success',
        title: isEditing ? 'Berhasil Diperbarui!' : 'Berhasil Ditambahkan!',
        text: `Mekanik ${formData.name} telah berhasil disimpan.`,
        showConfirmButton: false,
        timer: 2500,
        toast: true,
        position: 'top-end',
        timerProgressBar: true,
        customClass: {
          popup: 'swal2-toast-custom',
          title: 'swal2-title-custom',
          htmlContainer: 'swal2-html-custom'
        }
      });

    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: err.message,
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          htmlContainer: 'swal2-html-custom',
          confirmButton: 'swal2-confirm-btn-custom'
        },
        buttonsStyling: false
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await MySwal.fire({
      title: 'Hapus Mekanik?',
      text: `${name} (#${id}) akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
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
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('mechanics').delete().eq('id', id);
        if (error) throw error;
        fetchMekaniks();
        MySwal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Data mekanik telah dihapus.',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: 'top-end',
          customClass: {
            popup: 'swal2-toast-custom',
            title: 'swal2-title-custom',
            htmlContainer: 'swal2-html-custom'
          }
        });
      } catch (err) {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            htmlContainer: 'swal2-html-custom',
            confirmButton: 'swal2-confirm-btn-custom'
          },
          buttonsStyling: false
        });
      }
    }
  };

  const filteredMekaniks = useMemo(() => {
    return mekaniks.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase()) ||
      (m.access_role || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [mekaniks, search]);

  const totalPages = Math.ceil(filteredMekaniks.length / itemsPerPage);
  const paginatedMekaniks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMekaniks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMekaniks, currentPage]);

  return (
    <main className="py-4">
      <div className="container-fluid px-4 px-lg-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1 text-dark">Data Mekanik</h4>
            <p className="text-muted small mb-0">Kelola informasi mekanik dan hak akses sistem</p>
          </div>
          <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={openAddModal}>
            <i className="bi bi-plus-lg"></i>
            <span>Tambah Mekanik</span>
          </button>
        </div>

        <div className="row mb-4 g-3">
          <div className="col-md-8 col-lg-6">
            <div className="search-box">
              <i className="bi bi-search text-muted"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari Nama, Email, Jabatan, atau Role..." 
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
                  <th>Nama Lengkap</th>
                  <th>Spesialisasi</th>
                  <th>Hak Akses</th>
                  <th>Lokasi / Site</th>
                  <th>Status</th>
                  <th className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary spinner-border-sm" role="status"></div></td></tr>
                ) : paginatedMekaniks.length > 0 ? paginatedMekaniks.map((m) => (
                  <tr key={m.id}>
                    <td className="fw-bold text-primary">#{m.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className={`avatar-initials ${m.access_role === 'admin' ? 'bg-primary' : 'bg-success'} bg-opacity-10 ${m.access_role === 'admin' ? 'text-primary' : 'text-success'} me-3`}>
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
                      <span className={`badge ${m.access_role === 'admin' ? 'bg-primary' : 'bg-info'} bg-opacity-10 ${m.access_role === 'admin' ? 'text-primary' : 'text-info'} fw-bold text-uppercase`} style={{ fontSize: '0.65rem' }}>
                        {m.access_role || 'mechanic'}
                      </span>
                    </td>
                    <td>
                      <p className="mb-0 fw-semibold"><i className="bi bi-geo-alt-fill text-danger me-1"></i> {m.location}</p>
                    </td>
                    <td>
                      <span className="d-flex align-items-center gap-2">
                        <span className={`status-dot ${m.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}></span>
                        <span className={`fw-bold ${m.status === 'Active' ? 'text-success' : 'text-secondary'}`} style={{ fontSize: '0.8rem' }}>{m.status}</span>
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="action-btn edit" title="Edit" onClick={() => openEditModal(m)}><i className="bi bi-pencil-square"></i></button>
                      <button className="action-btn delete" title="Hapus" onClick={() => handleDelete(m.id, m.name)}><i className="bi bi-trash3-fill"></i></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-5 text-muted">Tidak ada data mekanik.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* Unified Mekanik Modal */}
      <div className="modal fade" id="mekanikModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg p-2">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">{isEditing ? `Edit Mekanik #${editId}` : "Tambah Mekanik Baru"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="section-divider">
                  <span className="section-divider-text">Informasi Personel & Hak Akses</span>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">NAMA LENGKAP</label>
                    <input type="text" name="name" className="form-control form-control-custom" placeholder="Contoh: Yudistira Rivaldi" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">HAK AKSES SISTEM (ROLE)</label>
                    <select name="access_role" className="form-select border-primary fw-bold form-control-custom" value={formData.access_role} onChange={handleInputChange} required>
                      <option value="mechanic">MECHANIC (Limited Access)</option>
                      <option value="admin">ADMIN (Full Access / Master Data)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">SPESIALISASI / JABATAN</label>
                    <select name="role" className="form-select form-control-custom" value={formData.role} onChange={handleInputChange} required>
                      <option value="">Pilih Spesialisasi</option>
                      <option value="Senior Mechanic">Senior Mechanic</option>
                      <option value="Hydraulic Specialist">Hydraulic Specialist</option>
                      <option value="Engine Specialist">Engine Specialist</option>
                      <option value="General Mechanic">General Mechanic</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">PENEMPATAN LOKASI</label>
                    <select name="location" className="form-select form-control-custom" value={formData.location} onChange={handleInputChange} required>
                      <option value="">Pilih Lokasi</option>
                      <option value="Pit Alpha">Pit Alpha</option>
                      <option value="Pit Bravo">Pit Bravo</option>
                      <option value="Workshop Utama">Workshop Utama</option>
                      <option value="Site Banjarbaru">Site Banjarbaru</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">STATUS AKUN</label>
                    <select name="status" className="form-select form-control-custom" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="section-divider mt-4">
                  <span className="section-divider-text">Detail Kredensial</span>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label-custom">EMAIL / USERNAME</label>
                    <input type="email" name="email" className="form-control form-control-custom" placeholder="yudis@uniquip.com" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">PASSWORD</label>
                    <input type="password" name="password" className="form-control form-control-custom" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required={!isEditing} />
                  </div>
                </div>

                <div className="modal-footer border-top-0 p-0 mt-4">
                  <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold" disabled={submitting}>
                    {submitting ? "Menyimpan..." : (isEditing ? "Update Mekanik" : "Simpan & Buat Akun")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
