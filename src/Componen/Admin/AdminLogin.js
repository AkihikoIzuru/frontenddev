import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminStyles.css";

const AdminLogin = ({ setIsAuthenticated }) => {
  // State untuk menyimpan nilai form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State untuk menangani error dan loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hook untuk navigasi
  const navigate = useNavigate();

  // Fungsi untuk menangani submit form login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Aktifkan loading state
    setError(""); // Reset pesan error

    try {
      // Kirim request login ke API
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/auth/signin`,
        {
          email,
          password,
        }
      );

      // Jika login berhasil dan mendapatkan token
      if (response.data.token) {
        // Simpan token dan nama admin ke localStorage
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminName", response.data.name || "Admin");

        // Update state autentikasi
        setIsAuthenticated(true);

        // Redirect ke dashboard admin
        navigate("/admin/dashboard");
      } else {
        // Jika tidak ada token dalam response
        setError("Login gagal. Silakan cek kredensial Anda.");
      }
    } catch (err) {
      console.error("Error login:", err);
      // Tampilkan pesan error dari server atau pesan default
      setError(
        err.response?.data?.message || "Login gagal. Silakan coba lagi."
      );
    } finally {
      // Matikan loading state baik berhasil maupun gagal
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Kartu login */}
      <div className="admin-login-card">
        {/* Header form login */}
        <div className="admin-login-header">
          <h2>Nusantara Brew</h2>
          <h3>Admin Login</h3>
        </div>

        {/* Tampilkan pesan error jika ada */}
        {error && <div className="admin-login-error">{error}</div>}

        {/* Form login */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          {/* Input email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Input password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {/* Tombol submit */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Sedang masuk..." : "Login"}
          </button>
        </form>

        {/* Footer dengan link kembali ke website utama */}
        <div className="admin-login-footer">
          <a href="/" className="back-to-site">
            Kembali ke Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
