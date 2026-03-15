"use client"

import Link from "next/link";
import "../../styles/login.css";

export default function LoginPage() {
  return (
    <div className="login-page d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card login-card p-4 p-md-5 animate-fade-up">
              <div className="text-center mb-4">
                <div className="mb-2">
                  <span className="badge bg-primary-subtle text-primary px-3 py-2">v1.0 Beta</span>
                </div>
                <h2 className="fw-800 text-dark">
                  MECH<span className="text-primary">LOG</span>
                </h2>
                <p className="text-muted small">Silahkan masuk untuk memulai laporan</p>
              </div>
              <form>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">ID MEKANIK</label>
                  <input 
                    type="text" 
                    className="form-control py-2 rounded-3" 
                    placeholder="Contoh: MKN-99" 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">PASSWORD</label>
                  <input 
                    type="password" 
                    className="form-control py-2 rounded-3" 
                    placeholder="••••••••" 
                  />
                </div>
                <Link href="/" className="btn btn-primary w-100 shadow-sm py-2 rounded-3 fw-bold">
                  Masuk Sekarang
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
