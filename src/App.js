"use client"

import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { Navbar } from "./Componen/Navbar"
import { Home } from "./Componen/Home"
import { Product } from "./Componen/Product"
import { Contact } from "./Componen/Contact"
import { About } from "./Componen/About"
import { CO } from "./Componen/CO"
import AdminLogin from "./Componen/Admin/AdminLogin"
import AdminDashboard from "./Componen/Admin/AdminDashboard"
import ProductManagement from "./Componen/Admin/ProductManagement"
import UserManagement from "./Componen/Admin/UserManagement"
import ProtectedRoute from "./Componen/Admin/ProtectedRoute"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem("adminToken")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
