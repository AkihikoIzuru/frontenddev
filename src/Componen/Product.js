import "./Product.css";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const Product = () => {
  // Referensi untuk elemen scroll (jika ingin menggunakan scroll horizontal)
  const scrollRef = useRef(null);

  // Lokasi URL saat ini, digunakan untuk mengambil query string (contoh: ?search=teh)
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil query parameter `search` dari URL, lalu ubah jadi huruf kecil
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // State untuk menyimpan data produk
  const [products, setProducts] = useState([]);
  // State untuk loading
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data produk dari API
  const fetchProducts = async () => {
    try {
      setLoading(true); // Tampilkan loading
      const response = await axios.get(
        `https://backenddev-six.vercel.app/api/products`
      );
      setProducts(response.data); // Simpan data produk
      setLoading(false); // Matikan loading
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false); // Tetap matikan loading meski error
    }
  };

  // Ambil data produk saat komponen pertama kali dirender
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter produk berdasarkan query pencarian dari URL
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );

  // Fungsi untuk berpindah ke halaman checkout sambil mengirim data produk
  const handleCheckout = (product) => {
    navigate("/checkout", { state: product });
  };

  return (
    <div className="container">
      <h1 className="title">Nusantara Brew</h1>
      <p className="subtitle">Cemilan dan Minuman Teh Nusantara</p>

      <div className="scroll-wrapper">
        <div className="grid-container" ref={scrollRef}>
          {loading ? (
            <p>Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div key={index} className="product-wrapper">
                <div className="product-card">
                  <div className="product-image-container">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                  <button
                    className="product-name"
                    onClick={() => handleCheckout(product)}
                  >
                    {product.name}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-result">Produk tidak ditemukan</p>
          )}
        </div>
      </div>
    </div>
  );
};
