import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Package,
  Users,
  LogOut,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
} from "lucide-react";
import "./AdminStyles.css";

const ProductManagement = () => {
  // State untuk manajemen produk
  const [products, setProducts] = useState([]); // Menyimpan daftar produk
  const [loading, setLoading] = useState(true); // Status loading saat fetch data
  const [showModal, setShowModal] = useState(false); // Kontrol tampilan modal form
  const [currentProduct, setCurrentProduct] = useState({
    // Data produk yang sedang diedit/ditambah
    name: "",
    price: "",
    description: "",
    image: null, // File gambar yang akan diupload
    stock: "",
    _id: null, // ID produk (null untuk produk baru)
    thumbnail: "", // URL gambar thumbnail
  });
  const [isEditing, setIsEditing] = useState(false); // Status edit/tambah baru
  const [error, setError] = useState(""); // Pesan error
  const [toast, setToast] = useState({ show: false, message: "", type: "" }); // Notifikasi toast

  // Hook untuk routing
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Effect untuk load data dan cek parameter URL
  useEffect(() => {
    fetchProducts(); // Ambil data produk saat komponen mount

    // Cek parameter URL untuk edit/tambah produk
    const editId = queryParams.get("edit");
    const isNew = queryParams.get("new");

    if (editId) {
      handleEdit(editId); // Buka modal edit jika ada parameter edit
    } else if (isNew) {
      handleAddNew(); // Buka modal tambah baru jika ada parameter new
    }
  }, [location.search]); // Jalankan ulang saat parameter URL berubah

  // Fungsi untuk mengambil data produk dari API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/products`
      );
      setProducts(response.data || []); // Simpan data produk
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membuka modal tambah produk baru
  const handleAddNew = () => {
    setCurrentProduct({
      name: "",
      price: "",
      description: "",
      image: null,
      stock: "",
      thumbnail: "",
    });
    setIsEditing(false); // Set status bukan edit
    setShowModal(true); // Tampilkan modal
  };

  // Fungsi untuk membuka modal edit produk
  const handleEdit = async (id) => {
    try {
      // Ambil detail produk dari API
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/products/${id}`
      );
      setCurrentProduct({ ...response.data, image: null }); // Set data produk, reset image untuk upload baru
    } catch (error) {
      console.error("Gagal mengambil detail produk:", error);
    }

    setIsEditing(true); // Set status edit
    setShowModal(true); // Tampilkan modal
  };

  // Fungsi untuk menghapus produk
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}api/products/${id}`
        );
        // Hapus produk dari state
        setProducts(products.filter((product) => product._id !== id));
        showToast("Produk berhasil dihapus", "success");
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
        showToast("Gagal menghapus produk", "error");
      }
    }
  };

  // Fungsi untuk submit form (tambah/edit produk)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset pesan error

    // Siapkan form data untuk upload
    const formData = new FormData();
    formData.append("name", currentProduct.name);
    formData.append("price", currentProduct.price);
    formData.append("description", currentProduct.description);
    formData.append("stock", currentProduct.stock);

    // Tambahkan file gambar jika ada
    if (currentProduct.image) {
      formData.append("thumbnail", currentProduct.image);
    }

    try {
      if (isEditing) {
        // Update produk yang ada
        await axios.patch(
          `${process.env.REACT_APP_BASE_URL}api/products/${currentProduct._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        fetchProducts(); // Refresh data produk
        showToast("Produk berhasil diperbarui", "success");
      } else {
        // Tambah produk baru
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}api/products`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProducts([...products, response.data]); // Tambahkan produk baru ke state
        showToast("Produk berhasil ditambahkan", "success");
      }

      setShowModal(false); // Tutup modal
      navigate("/admin/products"); // Kembali ke halaman produk
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      setError(error.response?.data?.message || "Gagal menyimpan produk");
    }
  };

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setCurrentProduct({ ...currentProduct, image: files[0] }); // Simpan file gambar
    } else {
      setCurrentProduct({ ...currentProduct, [name]: value }); // Update field lainnya
    }
  };

  // Fungsi untuk logout admin
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  // Fungsi untuk menampilkan notifikasi toast
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Fungsi untuk memformat harga ke format mata uang IDR
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

        <div className="admin-sidebar-menu">
          {/* Menu Dashboard */}
          <Link
            to="/admin/dashboard"
            className={`admin-sidebar-item ${
              location.pathname === "/admin/dashboard" ? "active" : ""
            }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          {/* Menu Produk */}
          <Link
            to="/admin/products"
            className={`admin-sidebar-item ${
              location.pathname === "/admin/products" ? "active" : ""
            }`}
          >
            <Package size={20} />
            <span>Products</span>
          </Link>

          {/* Menu Pengguna */}
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

        {/* Tombol Logout */}
        <div className="admin-sidebar-footer">
          <button className="admin-logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Konten utama */}
      <div className="admin-content">
        {/* Header konten */}
        <div className="admin-content-header">
          <h1 className="admin-content-title">Product Management</h1>
          <button className="admin-form-button primary" onClick={handleAddNew}>
            <Plus size={18} /> Add New Product
          </button>
        </div>

        {/* Tabel produk */}
        {loading ? (
          <p>Memuat data produk...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Nama</th>
                  <th>Harga</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.thumbnail || "/placeholder.svg"}
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.description}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-table-button edit"
                          onClick={() => handleEdit(product._id)}
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          className="admin-table-button delete"
                          onClick={() => handleDelete(product._id)}
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

        {/* Modal form produk */}
        {showModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="admin-modal-header">
                <h2 className="admin-modal-title">
                  {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                <button
                  className="admin-modal-close"
                  onClick={() => {
                    setShowModal(false);
                    navigate("/admin/products");
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="admin-modal-body">
                {error && <div className="admin-form-error">{error}</div>}

                <form
                  onSubmit={handleSubmit}
                  className="admin-form"
                  encType="multipart/form-data"
                >
                  <div className="admin-form-group">
                    <label htmlFor="name">Nama Produk</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={currentProduct.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="price">Harga (IDR)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="image">File Gambar</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div
                    className="admin-form-group"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label htmlFor="description">Deskripsi</label>
                    <textarea
                      id="description"
                      name="description"
                      value={currentProduct.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="admin-form-buttons">
                    <button
                      type="button"
                      className="admin-form-button secondary"
                      onClick={() => {
                        setShowModal(false);
                        navigate("/admin/products");
                      }}
                    >
                      Batal
                    </button>
                    <button type="submit" className="admin-form-button primary">
                      <Save size={18} />{" "}
                      {isEditing ? "Update Produk" : "Tambah Produk"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Notifikasi Toast */}
        {toast.show && (
          <div className={`toast toast-${toast.type}`}>{toast.message}</div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
