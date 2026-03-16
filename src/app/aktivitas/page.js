"use client"

import "../../styles/dashboard.css";

export default function LaporanBaru() {
  return (
    <main className="py-4">
      <div className="container-fluid px-4 px-lg-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            
            {/* Header Section */}
            <div className="text-center mb-5 animate-fade-up">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex mb-3">
                <i className="bi bi-lightning-charge-fill fs-2"></i>
              </div>
              <h3 className="fw-800 text-dark">Laporan Aktivitas Baru</h3>
              <p className="text-muted">Laporkan kendala unit atau update progres pengerjaan Anda</p>
            </div>

            {/* Form Card */}
            <div className="card card-custom p-4 p-md-5 shadow-lg border-0 animate-fade-up delay-1">
              <form>
                <div className="row g-4">
                  {/* Unit Selection */}
                  <div className="col-12">
                    <label className="text-xs fw-800 text-muted mb-2 d-block text-uppercase">Informasi Unit</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-4"><i className="bi bi-truck-flatbed"></i></span>
                      <input 
                        type="text" 
                        className="form-control border-0 bg-light py-3 rounded-end-4" 
                        placeholder="Masukkan ID Unit (Contoh: TRK-09 atau EXCA-201)" 
                      />
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="col-md-6">
                    <label className="text-xs fw-800 text-muted mb-2 d-block text-uppercase">Status Lapangan</label>
                    <select className="form-select border-0 bg-light py-3 rounded-4">
                      <option value="Breakdown">Breakdown (Mati)</option>
                      <option value="Proses">Dalam Pengerjaan</option>
                      <option value="Selesai">Selesai Perbaikan</option>
                    </select>
                  </div>

                  {/* Shift Selection */}
                  <div className="col-md-6">
                    <label className="text-xs fw-800 text-muted mb-2 d-block text-uppercase">Shift Kerja</label>
                    <select className="form-select border-0 bg-light py-3 rounded-4">
                      <option value="Siang">Shift Siang (07:00 - 19:00)</option>
                      <option value="Malam">Shift Malam (19:00 - 07:00)</option>
                    </select>
                  </div>

                  {/* Detail Problem */}
                  <div className="col-12">
                    <label className="text-xs fw-800 text-muted mb-2 d-block text-uppercase">Detail Pekerjaan / Kendala</label>
                    <textarea 
                      className="form-control border-0 bg-light py-3 rounded-4" 
                      rows={5} 
                      placeholder="Jelaskan secara mendetail apa yang terjadi pada unit atau apa yang sedang Anda kerjakan saat ini..."
                    ></textarea>
                  </div>

                  {/* Media Upload */}
                  <div className="col-12">
                    <label className="text-xs fw-800 text-muted mb-2 d-block text-uppercase">Lampiran Foto (Wajib)</label>
                    <div className="upload-area p-5 border-dashed rounded-4 bg-light text-center cursor-pointer transition hover-shadow">
                      <i className="bi bi-camera-fill fs-1 text-primary mb-2 d-block"></i>
                      <span className="fw-bold d-block text-dark">Klik untuk Tambah Foto</span>
                      <span className="text-muted small">Maksimal 5 foto • Format JPG/PNG</span>
                      <input type="file" className="d-none" multiple />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-5">
                    <button type="button" className="btn btn-primary w-100 py-3 rounded-4 fw-800 shadow-sm transition">
                      Kirim Laporan Sekarang <i className="bi bi-send-fill ms-2"></i>
                    </button>
                    <p className="text-center text-muted small mt-3 px-4">
                      Laporan yang dikirim akan langsung muncul di dashboard utama dan dapat dilihat oleh pengawas secara real-time.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
