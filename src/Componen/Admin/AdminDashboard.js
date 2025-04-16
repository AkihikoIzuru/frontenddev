import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Package,
  Users,
  LogOut,
  ShoppingBag,
  BarChart2,
  AlertCircle,
} from "lucide-react";
import "./AdminStyles.css";

const AdminDashboard = () => {
  // State untuk menyimpan statistik dashboard
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  // State untuk loading indicator
  const [loading, setLoading] = useState(true);

  // Hook untuk navigasi dan lokasi
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk daftar produk
  const [products, setProducts] = useState([]);

  // Fungsi untuk mengambil data dari API
  const fetch = async () => {
    try {
      // Mengambil data produk
      const Presponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/products`
      );

      // Mengambil data transaksi
      const Tresponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/transactions`
      );

      // Menyimpan data produk ke state
      setProducts(Presponse.data);

      // Update status loading jika data berhasil diambil
      if (Presponse.status === 200) {
        setLoading(false);
      }

      // Update statistik dashboard
      setStats({
        totalProducts: Presponse.data.length,
        totalOrders: Tresponse.data.length,
      });

      setLoading(false);
    } catch (error) {
      // Handle error jika terjadi kesalahan
      console.error("Gagal mengambil data:", error);
      setLoading(false);
    }
  };

  // Efek untuk memanggil fungsi fetch saat komponen pertama kali render
  useEffect(() => {
    fetch();
  }, []);

  // Fungsi untuk logout admin
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  // Fungsi untuk memformat mata uang
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar navigasi */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Nusantara Brew</h2>
          <p>Admin Panel</p>
        </div>

        {/* Menu sidebar */}
        <div className="admin-sidebar-menu">
          <Link
            to="/admin/dashboard"
            className={`admin-sidebar-item ${
              location.pathname === "/admin/dashboard" ? "active" : ""
            }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className={`admin-sidebar-item ${
              location.pathname === "/admin/products" ? "active" : ""
            }`}
          >
            <Package size={20} />
            <span>Products</span>
          </Link>

          <Link
            to="/admin/users"
            className={`admin-sidebar-item ${
              location.pathname === "/admin/users" ? "active" : ""
            }`}
          >
            <Users size={20} />
            <span>Users</span>
          </Link>
        </div>

        {/* Tombol logout */}
        <div className="admin-sidebar-footer">
          <button className="admin-logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Konten utama dashboard */}
      <div className="admin-content">
        <div className="admin-content-header">
          <h1 className="admin-content-title">Dashboard</h1>
          <p>Welcome back, {localStorage.getItem("adminName") || "Admin"}</p>
        </div>

        {/* Tampilkan loading jika data sedang diambil */}
        {loading ? (
          <p>Loading dashboard data...</p>
        ) : (
          <>
            {/* Kartu statistik */}
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="dashboard-card-icon">
                  <Package size={24} />
                </div>
                <div className="dashboard-card-content">
                  <h3>Total Products</h3>
                  <p>{stats.totalProducts}</p>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-icon">
                  <ShoppingBag size={24} />
                </div>
                <div className="dashboard-card-content">
                  <h3>Total Orders</h3>
                  <p>{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            {/* Tabel produk terbaru */}
            <div className="admin-content-section">
              <h2 className="admin-section-title">Recent Products</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          <div className="admin-table-actions">
                            <Link
                              to={`/admin/products?edit=${product._id}`}
                              className="admin-table-button view"
                            >
                              <BarChart2 size={16} /> View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-content-section">
              <h2 className="admin-section-title">Quick Actions</h2>
              <div className="dashboard-quick-actions">
                <Link
                  to="/admin/products?new=true"
                  className="admin-action-button"
                >
                  <Package size={18} /> Add New Product
                </Link>
                <Link to="/admin/users" className="admin-action-button">
                  <Users size={18} /> Manage Users
                </Link>
                <Link to="/" className="admin-action-button">
                  <AlertCircle size={18} /> View Website
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
