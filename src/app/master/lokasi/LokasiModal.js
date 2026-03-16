"use client"

export default function LokasiModal({ isEditing, editId, formData, handleInputChange, handleSubmit, submitting }) {
  return (
    <div className="modal fade" id="lokasiModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg p-2">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold">{isEditing ? `Edit Lokasi #${editId}` : "Tambah Lokasi Baru"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label-custom">NAMA LOKASI / AREA</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control form-control-custom" 
                  placeholder="Contoh: Pit Charlie" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label-custom">TIPE AREA</label>
                <select 
                  name="type" 
                  className="form-select form-control-custom" 
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Tipe</option>
                  <option value="Pit Mining">Pit Mining</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Office & Camp">Office & Camp</option>
                  <option value="Hauling Road">Hauling Road</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label-custom">KETERANGAN TAMBAHAN</label>
                <textarea 
                  name="description" 
                  className="form-control form-control-custom" 
                  rows="3" 
                  placeholder="Jelaskan detail lokasi..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="form-label-custom">STATUS</label>
                <select name="status" className="form-select form-control-custom" value={formData.status} onChange={handleInputChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-footer border-top-0 p-0 mt-4">
                <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
                <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold" disabled={submitting}>
                  {submitting ? "Menyimpan..." : (isEditing ? "Update Lokasi" : "Simpan Lokasi")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
