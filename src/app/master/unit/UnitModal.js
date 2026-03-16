"use client"

export default function UnitModal({ isEditing, editId, formData, handleInputChange, handleSubmit, submitting }) {
  return (
    <div className="modal fade" id="unitModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg p-2">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold">{isEditing ? `Edit Unit #${editId}` : "Tambah Unit Baru"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">KATEGORI UNIT</label>
                  <select name="type" className="form-select form-control-custom" value={formData.type} onChange={handleInputChange} required>
                    <option value="">Pilih Kategori</option>
                    <option value="Excavator">Excavator</option>
                    <option value="Dump Truck">Dump Truck</option>
                    <option value="Bulldozer">Bulldozer</option>
                    <option value="Grader">Grader</option>
                    <option value="Light Vehicle">Light Vehicle</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">TAHUN PEMBUATAN</label>
                  <input type="text" name="year" className="form-control form-control-custom" placeholder="202X" value={formData.year} onChange={handleInputChange} />
                </div>
                <div className="col-md-12">
                  <label className="form-label-custom">MODEL / BRAND</label>
                  <input type="text" name="model" className="form-control form-control-custom" placeholder="Contoh: Komatsu PC-200" value={formData.model} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">SERIAL NUMBER</label>
                  <input type="text" name="sn" className="form-control form-control-custom" placeholder="Nomor Rangka/Mesin" value={formData.sn} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">STATUS OPERASIONAL</label>
                  <select name="status" className="form-select form-control-custom" value={formData.status} onChange={handleInputChange}>
                    <option value="Ready">Ready</option>
                    <option value="Breakdown">Breakdown</option>
                    <option value="Maintenance">Scheduled Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer border-top-0 p-3 px-0 pb-0 mt-4">
                <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
                <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold" disabled={submitting}>
                  {submitting ? "Menyimpan..." : (isEditing ? "Update Data" : "Simpan Unit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
