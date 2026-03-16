"use client"

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import imageCompression from 'browser-image-compression'; // Import library kompresi
import "../../styles/dashboard.css";
import "../../styles/master.css";

const MySwal = withReactContent(Swal);

export default function AktivitasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Data Master untuk Dropdown
  const [units, setUnits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    unit_id: "",
    location_id: "",
    status: "Proses",
    description: "",
  });

  // Image Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      setCurrentUser(JSON.parse(session));
    } else {
      router.push("/login");
    }
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const [unitsData, locationsData] = await Promise.all([
        supabase.from('units').select('id, model'),
        supabase.from('locations').select('id, name')
      ]);
      setUnits(unitsData.data || []);
      setLocations(locationsData.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 5) {
      return MySwal.fire({
        icon: 'warning',
        title: 'Limit Maksimal',
        text: 'Maksimal 5 foto dalam satu laporan.',
        customClass: { popup: 'swal2-popup-custom' }
      });
    }

    setCompressing(true);
    const options = {
      maxSizeMB: 0.5, // Maksimal size 500KB (Super hemat!)
      maxWidthOrHeight: 1280, // Resize gambar ke HD
      useWebWorker: true,
    };

    try {
      const compressedFiles = [];
      const newPreviews = [];

      for (const file of files) {
        // Proses kompresi
        const compressedBlob = await imageCompression(file, options);
        // Ubah blob kembali ke file agar bisa diupload
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });

        compressedFiles.push(compressedFile);
        newPreviews.push(URL.createObjectURL(compressedFile));
      }

      setSelectedFiles((prev) => [...prev, ...compressedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error("Gagal kompresi:", error);
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
      return MySwal.fire({
        icon: 'error',
        text: 'Minimal upload 1 foto bukti pekerjaan.',
        customClass: { popup: 'swal2-popup-custom' }
      });
    }

    setSubmitting(true);
    try {
      const uploadedUrls = [];

      // 1. Upload ke Storage (Bucket: uniquip)
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uniquip') // Pakai nama bucket baru: uniquip
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uniquip')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // 2. Simpan ke Database
      const { error: dbError } = await supabase
        .from('activities')
        .insert([{
          unit_id: formData.unit_id,
          mechanic_id: currentUser.id,
          location_id: formData.location_id,
          status: formData.status,
          description: formData.description,
          image_urls: uploadedUrls
        }]);

      if (dbError) throw dbError;

      await MySwal.fire({
        icon: 'success',
        title: 'Laporan Terkirim!',
        text: 'Foto telah dikompresi agar hemat storage.',
        customClass: { popup: 'swal2-popup-custom', title: 'swal2-title-custom', confirmButton: 'swal2-confirm-btn-custom' },
        buttonsStyling: false
      });

      setFormData({ unit_id: "", location_id: "", status: "Proses", description: "" });
      setSelectedFiles([]);
      setPreviews([]);

    } catch (err) {
      console.error(err);
      MySwal.fire({ icon: 'error', title: 'Gagal Mengirim', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-4">
      <div className="container-fluid px-4 px-lg-5">

        <div className="header-card mb-4 animate-fade-up">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-4">
              <i className="bi bi-activity fs-4"></i>
            </div>
            <div>
              <h4 className="fw-800 mb-0">Input Aktivitas</h4>
              <p className="text-muted small mb-0">Laporan harian maintenance (Bucket: uniquip)</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 animate-fade-up delay-1">
            <div className="card border-0 shadow-sm rounded-5 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>

                  <div className="section-divider mb-4">
                    <span className="section-divider-text">Detail Laporan</span>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <label className="form-label-custom">PILIIH UNIT</label>
                      <select
                        className="form-select form-control-custom"
                        value={formData.unit_id}
                        onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                        required
                      >
                        <option value="">Pilih Unit Armada</option>
                        {units.map(u => <option key={u.id} value={u.id}>{u.model} (ID #{u.id})</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label-custom">LOKASI PENGERJAAN</label>
                      <select
                        className="form-select form-control-custom"
                        value={formData.location_id}
                        onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                        required
                      >
                        <option value="">Pilih Site / Pit</option>
                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label-custom">STATUS LAPANGAN</label>
                      <div className="d-flex gap-2">
                        {['Proses', 'Breakdown', 'Selesai'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`btn rounded-pill px-4 flex-grow-1 fw-bold ${formData.status === s ? 'btn-primary' : 'btn-light'}`}
                            onClick={() => setFormData({ ...formData, status: s })}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label-custom">DESKRIPSI KERUSAKAN / TINGKATAN</label>
                      <textarea
                        className="form-control form-control-custom"
                        rows="4"
                        placeholder="Contoh: Low power pada engine..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="section-divider mb-4">
                    <span className="section-divider-text">Dokumentasi Foto (Otomatis Kompres)</span>
                  </div>

                  <div className="mb-4">
                    <div className="upload-area mb-3">
                      <input
                        type="file"
                        id="fileInput"
                        multiple
                        accept="image/*"
                        className="d-none"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="fileInput" className="w-100 cursor-pointer">
                        <div className="p-5 border-dashed rounded-4 text-center bg-light text-muted transition hover-bg-white border-2">
                          {compressing ? (
                            <div className="spinner-border text-primary mb-2"></div>
                          ) : (
                            <i className="bi bi-camera fs-1 d-block mb-2"></i>
                          )}
                          <span className="fw-bold">{compressing ? "Mengompres Foto..." : "Klik untuk Ambil / Upload Foto"}</span>
                          <p className="small mb-0">File akan dikecilkan menjadi ~500KB otomatis</p>
                        </div>
                      </label>
                    </div>

                    <div className="row g-2">
                      {previews.map((url, index) => (
                        <div key={index} className="col-4 col-md-2">
                          <div className="position-relative rounded-3 overflow-hidden shadow-sm aspect-ratio-square">
                            <img src={url} className="w-100 h-100 object-fit-cover" alt="preview" />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1"
                              onClick={() => removeFile(index)}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill py-3 fw-bold shadow-sm"
                      disabled={submitting || compressing}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          MENGUPLOAD & MENYIMPAN...
                        </>
                      ) : (
                        "SUBMIT LAPORAN AKTIVITAS"
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0 animate-fade-up delay-2">
            <div className="card border-0 shadow-sm rounded-5 text-white p-4" style={{ background: 'var(--primary-gradient)' }}>
              <h5 className="fw-800 mb-3">Panduan Input Laporan</h5>
              <p className="small opacity-75 mb-4">Pastikan Anda mengisi laporan dengan akurat agar tim Admin dapat menganalisa kerusakan unit dengan cepat dan tepat.</p>
              <ul className="small list-unstyled d-flex flex-column gap-3 mb-0 opacity-90">
                <li><i className="bi bi-info-circle me-2"></i> <strong>Detail Kerusakan</strong>: Jelaskan gejala awal dan komponen yang terdampak secara spesifik.</li>
                <li><i className="bi bi-camera-fill me-2"></i> <strong>Foto Jelas</strong>: Lampirkan bukti foto dari jarak dekat maupun jauh (maks. 5 foto).</li>
                <li><i className="bi bi-geo-alt-fill me-2"></i> <strong>Cek Lokasi</strong>: Pastikan penempatan PIT/Site sudah sesuai dengan lokasi unit saat ini.</li>
                <li><i className="bi bi-lightning-fill me-2"></i> <strong>Update Status</strong>: Jangan lupa update status pengerjaan (Proses/Selesai).</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .border-dashed { border: 2px dashed #cbd5e1; }
        .hover-bg-white:hover { background-color: #fff !important; border-color: #2563eb; color: #2563eb !important; }
        .aspect-ratio-square { padding-top: 100%; height: 0; position: relative; }
        .aspect-ratio-square img { position: absolute; top: 0; left: 0; }
      `}</style>
    </main>
  );
}
