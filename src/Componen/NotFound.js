import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // opsional, untuk styling

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! Halaman tidak ditemukan.</p>
      <Link to="/" className="notfound-link">
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
