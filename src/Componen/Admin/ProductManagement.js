"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { Home, Package, Users, LogOut, ShoppingBag, Mail, Edit, Trash2, Plus, X, Save } from "lucide-react"
import "./AdminStyles.css"

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState({ show: false, message: "", type: "" })

  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  useEffect(() => {
    fetchProducts()

    // Check if we should open the modal for editing or creating
    const editId = queryParams.get("edit")
    const isNew = queryParams.get("new")

    if (editId) {
      handleEdit(editId)
    } else if (isNew) {
      handleAddNew()
    }
  }, [location.search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("adminToken")
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setProducts(response.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      // Set some default data for demonstration
      setProducts([
        {
          _id: "1",
          name: "Apple Tea",
          price: 7000,
          description: "Refreshing apple flavored tea",
          image: "/productAssets/AppleTea.png",
          stock: 100,
        },
        {
          _id: "2",
          name: "Blackcurrant Tea",
          price: 7000,
          description: "Rich blackcurrant flavored tea",
          image: "/productAssets/Blackcurrant Tea.png",
          stock: 85,
        },
        {
          _id: "3",
          name: "Bublegum Tea",
          price: 7000,
          description: "Sweet bubblegum flavored tea",
          image: "/productAssets/Bublegum.png",
          stock: 120,
        },
        {
          _id: "4",
          name: "Grape Tea",
          price: 7000,
          description: "Grape flavored tea",
          image: "/productAssets/Grape Tea.png",
          stock: 75,
        },
        {
          _id: "5",
          name: "Mango Tea",
          price: 7000,
          description: "Tropical mango flavored tea",
          image: "/productAssets/MangoTea.png",
          stock: 90,
        },
        {
          _id: "6",
          name: "Markisa Tea",
          price: 7000,
          description: "Exotic passion fruit tea",
          image: "/productAssets/MarkisaTea.png",
          stock: 110,
        },
        {
          _id: "7",
          name: "Strawberry Tea",
          price: 7000,
          description: "Sweet strawberry flavored tea",
          image: "/productAssets/Sreawberry Tea.png",
          stock: 95,
        },
        {
          _id: "8",
          name: "Thai Tea",
          price: 7000,
          description: "Traditional Thai tea",
          image: "/productAssets/ThaiTea.png",
          stock: 80,
        },
        {
          _id: "9",
          name: "Roasted Sweet Potato",
          price: 7000,
          description: "Roasted sweet potato drink",
          image: "/productAssets/Ubi.png",
          stock: 70,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setCurrentProduct({
      name: "",
      price: "",
      description: "",
      image: "",
      stock: "",
    })
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setCurrentProduct(response.data)
    } catch (error) {
      console.error("Error fetching product details:", error)
      // Find product in local state for demonstration
      const product = products.find((p) => p._id === id)
      if (product) {
        setCurrentProduct(product)
      }
    }

    setIsEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("adminToken")
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Update local state
        setProducts(products.filter((product) => product._id !== id))
        showToast("Product deleted successfully", "success")
      } catch (error) {
        console.error("Error deleting product:", error)
        showToast("Failed to delete product", "error")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const token = localStorage.getItem("adminToken")
      const productData = {
        name: currentProduct.name,
        price: Number(currentProduct.price),
        description: currentProduct.description,
        image: currentProduct.image,
        stock: Number(currentProduct.stock),
      }

      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/api/products/${currentProduct._id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Update local state
        setProducts(
          products.map((product) => (product._id === currentProduct._id ? { ...product, ...productData } : product)),
        )

        showToast("Product updated successfully", "success")
      } else {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/products`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Update local state
        setProducts([...products, response.data])
        showToast("Product added successfully", "success")
      }

      setShowModal(false)
      navigate("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      setError(error.response?.data?.message || "Failed to save product")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentProduct({ ...currentProduct, [name]: value })
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminName")
    navigate("/admin/login")
  }

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

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
            className={`admin-sidebar-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className={`admin-sidebar-item ${location.pathname === "/admin/products" ? "active" : ""}`}
          >
            <Package size={20} />
            <span>Products</span>
          </Link>

          <Link
            to="/admin/users"
            className={`admin-sidebar-item ${location.pathname === "/admin/users" ? "active" : ""}`}
          >
            <Users size={20} />
            <span>Users</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`admin-sidebar-item ${location.pathname === "/admin/orders" ? "active" : ""}`}
          >
            <ShoppingBag size={20} />
            <span>Orders</span>
          </Link>

          <Link
            to="/admin/messages"
            className={`admin-sidebar-item ${location.pathname === "/admin/messages" ? "active" : ""}`}
          >
            <Mail size={20} />
            <span>Messages</span>
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
          <h1 className="admin-content-title">Product Management</h1>
          <button className="admin-form-button primary" onClick={handleAddNew}>
            <Plus size={18} /> Add New Product
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-table-button edit" onClick={() => handleEdit(product._id)}>
                          <Edit size={16} /> Edit
                        </button>
                        <button className="admin-table-button delete" onClick={() => handleDelete(product._id)}>
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

        {/* Product Form Modal */}
        {showModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="admin-modal-header">
                <h2 className="admin-modal-title">{isEditing ? "Edit Product" : "Add New Product"}</h2>
                <button
                  className="admin-modal-close"
                  onClick={() => {
                    setShowModal(false)
                    navigate("/admin/products")
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="admin-modal-body">
                {error && <div className="admin-form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                  <div className="admin-form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={currentProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="price">Price (IDR)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={currentProduct.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={currentProduct.image}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={currentProduct.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="admin-form-buttons">
                    <button
                      type="button"
                      className="admin-form-button secondary"
                      onClick={() => {
                        setShowModal(false)
                        navigate("/admin/products")
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="admin-form-button primary">
                      <Save size={18} /> {isEditing ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
      </div>
    </div>
  )
}

export default ProductManagement
