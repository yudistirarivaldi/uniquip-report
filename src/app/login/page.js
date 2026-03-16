"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";
import "../../styles/login.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Cek User ke Supabase
      const { data, error } = await supabase
        .from('mechanics')
        .select('*')
        .eq('email', email)
        .eq('password', password) // Catatan: Di produksi, sebaiknya password di-hash
        .single();

      if (error || !data) {
        throw new Error("Email atau Password salah!");
      }

      // 2. Cek Status Akun (Active/Inactive)
      if (data.status !== "Active") {
        throw new Error("Akun Anda dinonaktifkan. Silakan hubungi Admin.");
      }

      // 2. Simpan session sederhana di LocalStorage
      localStorage.setItem("user_session", JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.access_role // Sesuai kolom database kita
      }));

      // 3. Notifikasi Sukses
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: `Selamat datang, ${data.name}`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        customClass: {
          popup: 'swal2-toast-custom',
          title: 'swal2-title-custom',
          htmlContainer: 'swal2-html-custom'
        }
      });

      router.push("/");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
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

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-5">
            <div className="card login-card p-4 p-md-5 animate-fade-up">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <img 
                    src="https://www.uniquip.co.id/wp-content/uploads/2023/02/Logo-Uniquip-Hitam.png" 
                    alt="Uniquip Logo" 
                    style={{ height: "50px", objectFit: "contain" }}
                  />
                </div>
                <p className="text-muted small">Monitoring & Reporting System</p>
              </div>
              <form onSubmit={handleLogin}>
                <div className="mb-3 text-start">
                  <label className="form-label-custom">EMAIL ADDRESS</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><i className="bi bi-envelope"></i></span>
                    <input 
                      type="email" 
                      className="form-control form-control-custom" 
                      placeholder="name@uniquip.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4 text-start">
                  <label className="form-label-custom">PASSWORD</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><i className="bi bi-lock"></i></span>
                    <input 
                      type="password" 
                      className="form-control form-control-custom" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? "AUTHENTICATING..." : "SIGN IN"}
                </button>
              </form>
            </div>
            <p className="text-center mt-4 text-muted small">
              &copy; 2024 PT Uniquip. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
