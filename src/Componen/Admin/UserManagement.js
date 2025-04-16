import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Home, Package, Users, LogOut, Trash2, X, Save } from "lucide-react";
import "./AdminStyles.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/users`
      );
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      const user = users.find((u) => u._id === id);
      if (user) {
        setCurrentUser(user);
      }
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}api/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
        showToast("User deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        showToast("Failed to delete user", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      const userData = {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
      };

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}api/users/${currentUser._id}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(
        users.map((user) =>
          user._id === currentUser._id ? { ...user, ...userData } : user
        )
      );
      showToast("User updated successfully", "success");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  return (
    <div className="admin-dashboard">
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

      <div className="admin-content">
        <div className="admin-content-header">
          <h1 className="admin-content-title">User Management</h1>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-role ${user.role}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-table-button delete"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="admin-modal-header">
                <h2 className="admin-modal-title">Edit User</h2>
                <button
                  className="admin-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="admin-modal-body">
                {error && <div className="admin-form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                  <div className="admin-form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={currentUser.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={currentUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={currentUser.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      name="role"
                      value={currentUser.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="admin-form-buttons">
                    <button
                      type="button"
                      className="admin-form-button secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="admin-form-button primary">
                      <Save size={18} /> Update User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {toast.show && (
          <div className={`toast toast-${toast.type}`}>{toast.message}</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
