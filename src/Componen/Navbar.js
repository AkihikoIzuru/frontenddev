"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Menu, X } from "lucide-react"
import "./Navbar.css"
import Logo from "./homeAssets/logo.png"

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    // Prevent scrolling when mobile menu is open
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])

  // Fungsi pencarian
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/Product?search=${searchTerm}`)
      setMenuOpen(false)
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo-container">
          <img src={Logo || "/placeholder.svg"} alt="Nusantara Brew" className="navbar-logo" />
          <span className="navbar-brand">Nusantara Brew</span>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
        </button>

        {/* Menu */}
        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/Product" className="navbar-link" onClick={closeMenu}>
              Product
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/Contact" className="navbar-link" onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/About" className="navbar-link" onClick={closeMenu}>
              About
            </Link>
          </li>

          {/* Search in mobile menu */}
          {menuOpen && (
            <div className="search-container" ref={searchRef}>
              <input
                type="text"
                className="search-input active"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-icon" onClick={handleSearch}>
                <Search size={20} color="#fff" />
              </button>
            </div>
          )}
        </ul>

        {/* Search for desktop */}
        {!menuOpen && (
          <div className="search-container" ref={searchRef}>
            <input
              type="text"
              className="search-input active"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-icon" onClick={handleSearch}>
              <Search size={20} color="#fff" />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
