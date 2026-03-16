"use client"

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import imageCompression from 'browser-image-compression';
import "../../styles/dashboard.css";
import "../../styles/master.css";

const MySwal = withReactContent(Swal);

export default function AktivitasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  
  // Data State
  const [activities, setActivities] = useState([]);
  const [units, setUnits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form State
  const [formData, setFormData] = useState({
    unit_id: "",
    location_id: "",
    status: "Proses",
    description: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      setCurrentUser(JSON.parse(session));
    } else {
      router.push("/login");
    }
    fetchData();
    fetchMasterData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          units (model, type),
          mechanics (name),
          locations (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [unitsData, locationsData] = await Promise.all([
        supabase.from('units').select('id, model'),
        supabase.from('locations').select('id, name')
      ]);
      setUnits(unitsData.data || []);
      setLocations(locationsData.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      return MySwal.fire({
        icon: 'warning',
        title: 'Limit Maksimal',
        text: 'Maksimal 5 foto per laporan.',
        customClass: { popup: 'swal2-popup-custom' }
      });
    }

    setCompressing(true);
    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true };

    try {
      const compressedFiles = [];
      const newPreviews = [];
      for (const file of files) {
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });
        compressedFiles.push(compressedFile);
        newPreviews.push(URL.createObjectURL(compressedFile));
      }
      setSelectedFiles((prev) => [...prev, ...compressedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error(error);
    } finally {
      setCompressing(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      return MySwal.fire({ icon: 'error', text: 'Minimal upload 1 foto bukti.', customClass: { popup: 'swal2-popup-custom' } });
    }

    setSubmitting(true);
    try {
      const uploadedUrls = [];
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `reports/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('uniquip').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('uniquip').getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }

      const { error: dbError } = await supabase.from('activities').insert([{
        unit_id: formData.unit_id,
        mechanic_id: currentUser.id,
        location_id: formData.location_id,
        status: formData.status,
        description: formData.description,
        image_urls: uploadedUrls
      }]);

      if (dbError) throw dbError;

      MySwal.fire({
        icon: 'success',
        title: 'Laporan Berhasil!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        customClass: { popup: 'swal2-toast-custom' }
      });

      // Reset
      setFormData({ unit_id: "", location_id: "", status: "Proses", description: "" });
      setSelectedFiles([]);
      setPreviews([]);
      
      // Close Modal
      const bootstrap = await import("bootstrap");
      const modal = document.getElementById('addActivityModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }

      fetchData();
    } catch (err) {
      console.error(err);
      MySwal.fire({ icon: 'error', title: 'Gagal', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = useMemo(() => {
    return activities.filter(item => {
      const matchesSearch = 
        item.units?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mechanics?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "Semua" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [activities, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const openAddModal = async () => {
    const bootstrap = await import("bootstrap");
    const modalElement = document.getElementById('addActivityModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

  const openDetailModal = async (item) => {
    setSelectedItem(item);
    const bootstrap = await import("bootstrap");
    const modalElement = document.getElementById('detailActivityModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai': return 'bg-success bg-opacity-10 text-success';
      case 'Proses': return 'bg-warning bg-opacity-10 text-dark';
      case 'Breakdown': return 'bg-danger bg-opacity-10 text-danger';
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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-up">
          <div>
            <h4 className="fw-bold mb-1 text-dark">History Aktivitas</h4>
            <p className="text-muted small mb-0">Monitoring laporan pengerjaan unit dengan desain premium</p>
          </div>
          <button onClick={openAddModal} className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i>
            <span>Tambah Aktivitas</span>
          </button>
        </div>

        {/* Filter Section - Matching Style */}
        <div className="row mb-4 g-3 animate-fade-up delay-1">
          <div className="col-md-7 col-lg-6">
            <div className="search-box">
              <i className="bi bi-search text-muted"></i>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Cari Unit, Mekanik, atau Laporan..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          <div className="col-md-5 col-lg-3">
            <select 
              className="form-select border-0 bg-white shadow-sm py-2 rounded-3 fw-600 px-3 cursor-pointer"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              style={{ height: '48px', border: '1px solid #e2e8f0' }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Proses">Proses</option>
              <option value="Breakdown">Breakdown</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Table Section - Matching Master Data Style */}
        <div className="table-custom-container animate-fade-up delay-2">
          <div className="table-responsive">
            <table className="table table-custom table-borderless mb-0">
              <thead>
                <tr>
                  <th>No/ID</th>
                  <th>Tanggal & Jam</th>
                  <th>Unit Armada</th>
                  <th>Mekanik</th>
                  <th>Lokasi Site</th>
                  <th>Status</th>
                  <th className="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary spinner-border-sm" role="status"></div></td></tr>
                ) : paginatedActivities.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-5 text-muted">Data tidak ditemukan.</td></tr>
                ) : paginatedActivities.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold text-primary">#{item.id}</td>
                    <td>
                      <div className="fw-semibold text-dark">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                      <div className="text-xs text-muted">{new Date(item.created_at).toLocaleTimeString('id-ID')} WITA</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 me-3">
                          <i className={`bi ${getUnitIcon(item.units?.type)}`}></i>
                        </div>
                        <div>
                          <span className="fw-bold d-block">{item.units?.model}</span>
                          <span className="text-muted text-xs">{item.units?.type}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-initials bg-info bg-opacity-10 text-info">
                          {item.mechanics?.name?.charAt(0)}
                        </div>
                        <span className="fw-semibold">{item.mechanics?.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border-0 fw-600 px-3 py-2 rounded-pill">
                        <i className="bi bi-geo-alt-fill me-1 text-primary"></i>
                        {item.locations?.name}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 fw-800 text-uppercase ${getStatusBadge(item.status)}`} style={{ fontSize: '0.7rem' }}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-end pe-4 text-center">
                      <button 
                        onClick={() => openDetailModal(item)}
                        className="action-btn edit" 
                        title="Lihat Detail"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination UI - Matching Master Data Style */}
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

      {/* --- MODAL ADD ACTIVITY --- */}
      <div className="modal fade" id="addActivityModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg rounded-5">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="fw-800 mb-0">Input Laporan Aktivitas</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label-custom">PILIH UNIT</label>
                    <select className="form-select form-control-custom" value={formData.unit_id} onChange={(e) => setFormData({...formData, unit_id: e.target.value})} required>
                      <option value="">Pilih Unit</option>
                      {units.map(u => <option key={u.id} value={u.id}>{u.model}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">LOKASI PENGERJAAN</label>
                    <select className="form-select form-control-custom" value={formData.location_id} onChange={(e) => setFormData({...formData, location_id: e.target.value})} required>
                      <option value="">Pilih Lokasi</option>
                      {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label-custom">STATUS PENGERJAAN</label>
                    <div className="d-flex gap-2">
                      {['Proses', 'Breakdown', 'Selesai'].map(s => (
                        <button key={s} type="button" className={`btn rounded-pill px-4 flex-grow-1 fw-bold ${formData.status === s ? 'btn-primary' : 'btn-light'}`} onClick={() => setFormData({...formData, status: s})}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label-custom">DETAIL KERUSAKAN / PEKERJAAN</label>
                    <textarea className="form-control form-control-custom" rows="4" placeholder="Jelaskan secara detail tindakan yang dilakukan..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                  </div>
                </div>

                <div className="upload-area mb-3">
                  <input type="file" id="fileInput" multiple accept="image/*" className="d-none" onChange={handleFileChange} />
                  <label htmlFor="fileInput" className="w-100 cursor-pointer">
                    <div className="p-4 border-dashed rounded-4 text-center bg-light text-muted transition hover-bg-white border-2">
                      {compressing ? <div className="spinner-border text-primary spinner-border-sm mb-2"></div> : <i className="bi bi-camera fs-2 d-block mb-1"></i>}
                      <span className="fw-bold d-block">{compressing ? "Mengompres..." : "Upload Foto (Maks 5)"}</span>
                    </div>
                  </label>
                </div>

                <div className="row g-2 mb-4">
                  {previews.map((url, index) => (
                    <div key={index} className="col-auto">
                      <div className="position-relative rounded-3 overflow-hidden" style={{ width: '80px', height: '80px' }}>
                        <img src={url} className="w-100 h-100 object-fit-cover" alt="preview" />
                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 rounded-circle" style={{ width: '20px', height: '20px' }} onClick={() => removeFile(index)}><i className="bi bi-x"></i></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary rounded-pill py-3 fw-bold shadow-sm" disabled={submitting || compressing}>
                    {submitting ? "MENGIRIM..." : "SUBMIT LAPORAN"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DETAIL ACTIVITY --- */}
      <div className="modal fade" id="detailActivityModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg rounded-5 overflow-hidden">
            <div className="modal-header border-bottom p-4 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                  <i className="bi bi-file-earmark-text fs-5"></i>
                </div>
                <h5 className="fw-800 mb-0 text-dark">Laporan Detail #{selectedItem?.id}</h5>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            
            <div className="modal-body p-4 bg-light bg-opacity-50">
              <div className="row g-4">
                {/* Info Header */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                    <label className="text-xs fw-800 text-muted text-uppercase mb-2 d-block">Identitas Unit</label>
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-4">
                        <i className={`bi ${getUnitIcon(selectedItem?.units?.type)} fs-4`}></i>
                      </div>
                      <div>
                        <div className="fw-900 fs-5 text-dark mb-0">{selectedItem?.units?.model}</div>
                        <div className="text-muted small fw-600">{selectedItem?.units?.type}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                    <label className="text-xs fw-800 text-muted text-uppercase mb-2 d-block">Personil Lapangan</label>
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-initials bg-info bg-opacity-10 text-info fs-5" style={{ width: '54px', height: '54px' }}>
                        {selectedItem?.mechanics?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="fw-900 fs-6 text-dark mb-0">{selectedItem?.mechanics?.name}</div>
                        <div className="text-muted small fw-bold">
                          <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
                          {selectedItem?.locations?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Time */}
                <div className="col-12">
                  <div className="d-flex flex-wrap gap-2">
                    <div className="bg-white px-3 py-2 rounded-pill shadow-sm border d-flex align-items-center gap-2">
                       <i className="bi bi-clock-history text-primary"></i>
                       <span className="text-xs fw-800 text-dark">{new Date(selectedItem?.created_at).toLocaleString('id-ID')} WITA</span>
                    </div>
                    <div className={`px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2 fw-800 text-xs text-uppercase ${getStatusBadge(selectedItem?.status)}`}>
                       <span className={`status-dot ${selectedItem?.status === 'Breakdown' ? 'bg-danger' : selectedItem?.status === 'Proses' ? 'bg-warning' : 'bg-success'}`}></span>
                       {selectedItem?.status}
                    </div>
                  </div>
                </div>

                {/* Content Section - CLEAN WHITE STYLE */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <div className="card-header bg-white border-bottom p-3">
                      <span className="text-xs fw-800 text-muted text-uppercase">Deskripsi Pengerjaan / Masalah</span>
                    </div>
                    <div className="card-body p-4">
                      <div className="p-3 rounded-4 bg-light border-start border-4 border-primary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#334155', fontSize: '1rem' }}>
                        {selectedItem?.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Section */}
                {selectedItem?.image_urls?.length > 0 && (
                  <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                      <div className="card-header bg-white border-bottom p-3">
                        <span className="text-xs fw-800 text-muted text-uppercase">Lampiran Foto Dokumentasi</span>
                      </div>
                      <div className="card-body p-3">
                        <div className="row g-3">
                          {selectedItem.image_urls.map((url, idx) => (
                            <div key={idx} className="col-6 col-md-4">
                              <div className="position-relative overflow-hidden rounded-4 shadow-sm hover-zoom-container">
                                <img 
                                  src={url} 
                                  className="w-100 cursor-pointer object-fit-cover transition-img" 
                                  style={{ height: '160px' }} 
                                  alt="evidence" 
                                  onClick={() => window.open(url, '_blank')} 
                                />
                                <div className="img-overlay">
                                  <i className="bi bi-zoom-in text-white fs-4"></i>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer border-top p-4 bg-white d-flex justify-content-between">
               <div className="text-xs text-muted">Laporan terverifikasi sistem Uniquip</div>
               <button type="button" className="btn btn-dark rounded-pill px-5 fw-bold" data-bs-dismiss="modal">Tutup Laporan</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-zoom:hover { transform: scale(1.02); transition: 0.3s; }
        .border-dashed { border: 2px dashed #cbd5e1; }
        .hover-bg-white:hover { background: white !important; border-color: var(--bs-primary); }
        .transition-img { transition: transform 0.5s ease; }
        .hover-zoom-container:hover .transition-img { transform: scale(1.1); }
        .img-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
        .hover-zoom-container:hover .img-overlay { opacity: 1; }
      `}</style>
    </main>
  );
}
