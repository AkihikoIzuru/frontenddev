import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Package,
  Users,
  LogOut,
  ShoppingBag,
  Mail,
  BarChart2,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import "./AdminStyles.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  // const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `https://backenddev-six.vercel.app/api/products`
      );
      setProducts(response.data);

      if (response.status === 200) {
        setLoading(false);
      }

      setStats(
        response.data || {
          totalProducts: 9,
          totalUsers: 24,
          totalOrders: 56,
          totalRevenue: 4500000,
        }
      );

      // setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const token = localStorage.getItem("adminToken")

  //       // Fetch dashboard statistics
  //       const statsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/admin/dashboard/stats`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })

  //       // Fetch recent products
  //       const productsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products?limit=5`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })

  //       setRecentProducts(productsResponse.data || [])
  //     } catch (error) {
  //       console.error("Error fetching dashboard data:", error)
  //       // Set some default data for demonstration
  //       setStats({
  //         totalProducts: 9,
  //         totalUsers: 24,
  //         totalOrders: 56,
  //         totalRevenue: 4500000,
  //       })

  //       setRecentProducts([
  //         { _id: "1", name: "Apple Tea", price: 7000, stock: 100 },
  //         { _id: "2", name: "Blackcurrant Tea", price: 7000, stock: 85 },
  //         { _id: "3", name: "Bublegum Tea", price: 7000, stock: 120 },
  //         { _id: "4", name: "Grape Tea", price: 7000, stock: 75 },
  //         { _id: "5", name: "Mango Tea", price: 7000, stock: 90 },
  //       ])
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchDashboardData()
  // }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Nusantara Brew</h2>
          <p>Admin Panel</p>
        </div>

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

        <div className="admin-sidebar-footer">
          <button className="admin-logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-content-header">
          <h1 className="admin-content-title">Dashboard</h1>
          <p>Welcome back, {localStorage.getItem("adminName") || "Admin"}</p>
        </div>

        {loading ? (
          <p>Loading dashboard data...</p>
        ) : (
          <>
            {/* Stats Cards */}
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
                  <Users size={24} />
                </div>
                <div className="dashboard-card-content">
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
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

              <div className="dashboard-card">
                <div className="dashboard-card-icon">
                  <DollarSign size={24} />
                </div>
                <div className="dashboard-card-content">
                  <h3>Total Revenue</h3>
                  <p>{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="admin-content-section">
              <h2 className="admin-section-title">Recent Products</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.stock}</td>
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
