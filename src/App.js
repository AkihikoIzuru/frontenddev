import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "./Componen/Navbar";
import { Home } from "./Componen/Home";
import { Product } from "./Componen/Product";
import { Contact } from "./Componen/Contact";
import { About } from "./Componen/About";
import { CO } from "./Componen/CO";
import AdminLogin from "./Componen/Admin/AdminLogin";
import AdminDashboard from "./Componen/Admin/AdminDashboard";
import ProductManagement from "./Componen/Admin/ProductManagement";
import UserManagement from "./Componen/Admin/UserManagement";
import ProtectedRoute from "./Componen/Admin/ProtectedRoute";
import NotFound from "./Componen/NotFound";

function App() {
  // State untuk menyimpan status autentikasi admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Cek token autentikasi admin saat aplikasi pertama kali dimuat
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true); // Jika token ada, berarti admin sudah login
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route Publik - halaman yang bisa diakses oleh semua pengguna */}

          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/product"
            element={
              <>
                <Navbar />
                <Product />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbar />
                <CO />
              </>
            }
          />

          {/* Route Admin - hanya bisa diakses jika sudah login sebagai admin */}

          {/* Halaman login admin */}
          <Route
            path="/admin/login"
            element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* Dashboard admin (dilindungi dengan ProtectedRoute) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Manajemen produk oleh admin */}
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />

          {/* Manajemen pengguna oleh admin */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
