"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react"; // Import ikon pencarian
import "./Navbar.css";
import Logo from "./homeAssets/logo.png";

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi pencarian
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/Product?search=${searchTerm}`);
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo-container">
          <img
            src={Logo || "/placeholder.svg"}
            alt="Nusantara Brew"
            className="navbar-logo"
          />
          <span className="navbar-brand">Nusantara Brew</span>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? (
            <X size={24} color="#fff" />
          ) : (
            <Menu size={24} color="#fff" />
          )}
        </button>

        {/* Menu */}
        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <Link
              to="/"
              className="navbar-link"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/Product"
              className="navbar-link"
              onClick={() => setMenuOpen(false)}
            >
              Product
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/Contact"
              className="navbar-link"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/About"
              className="navbar-link"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
        </ul>

        {/* Search dengan ikon */}
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
            <Search size={20} color="#333" />
          </button>
        </div>
      </div>
    </nav>
  );
};
