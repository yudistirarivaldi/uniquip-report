"use client"

export default function MekanikModal({ isEditing, editId, formData, handleInputChange, handleSubmit, submitting, locations = [] }) {
  return (
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
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
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
  );
}
