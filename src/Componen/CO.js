import "./CO.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const CO = () => {
  // Hook untuk routing dan navigasi
  const location = useLocation();
  const navigate = useNavigate();

  // Mengambil data produk dari state location atau localStorage
  const product = location.state || JSON.parse(localStorage.getItem("product"));

  // State untuk jumlah produk yang dibeli
  const [quantity, setQuantity] = useState(1);

  // State untuk indikator loading saat proses pembayaran
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan informasi customer
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
  });

  // State untuk toggle antara tampilan produk dan form pembayaran
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Menyimpan produk ke localStorage jika tersedia
    if (product) {
      localStorage.setItem("product", JSON.stringify(product));
    }

    // Memuat script Midtrans Snap untuk pembayaran
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.REACT_APP_MIDTRANS_CLIENT_KEY
    );
    document.body.appendChild(script);

    // Cleanup: menghapus script ketika komponen unmount
    return () => {
      document.body.removeChild(script);
    };
  }, [product]);

  // Tampilkan pesan error jika tidak ada produk yang dipilih
  if (!product) {
    return <p className="error-message">Tidak ada produk yang dipilih.</p>;
  }

  // Fungsi untuk mengubah jumlah produk (tambah/kurang)
  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // Menghitung total harga berdasarkan jumlah produk
  const calculateTotal = () => {
    const basePrice = product.price;
    return basePrice * quantity;
  };

  // Handler untuk tombol Beli Sekarang
  const handleBuy = () => {
    setShowForm(true);
  };

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk proses pembayaran
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menyiapkan data order untuk dikirim ke backend
      const orderData = {
        product_id: product._id,
        product_name: product.name,
        amount: calculateTotal(),
        quantity: quantity,
        first_name: customerInfo.name,
      };

      // Mengirim data transaksi ke backend
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/transactions`,
        orderData
      );

      // Membuka halaman pembayaran Midtrans Snap
      window.snap.pay(response.data.midtrans_url, {
        onSuccess: (result) => {
          alert("Pembayaran berhasil!");
          navigate("/");
        },
        onPending: (result) => {
          alert("Pembayaran tertunda!");
        },
        onError: (result) => {
          alert("Pembayaran gagal!");
        },
        onClose: () => {
          alert(
            "Anda menutup halaman pembayaran sebelum menyelesaikan transaksi"
          );
        },
      });
    } catch (error) {
      console.error("Error pembayaran:", error);
      alert("Gagal memproses pembayaran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        {/* Tampilan gambar produk */}
        <img
          src={product.thumbnail || "/placeholder.svg"}
          alt={product.name}
          className="checkout-image"
        />

        <div className="checkout-details">
          {/* Informasi produk */}
          <h2 className="checkout-product-name">{product.name}</h2>
          <p className="checkout-description">{product.description}</p>

          {/* Pengatur jumlah produk */}
          <div className="quantity-selector">
            <button
              className="quantity-btn"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              className="quantity-btn"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>

          {/* Total harga */}
          <div className="checkout-total">
            <p>Total: Rp {calculateTotal().toLocaleString()}</p>
          </div>

          {/* Tampilan kondisional: form pembayaran atau tombol beli */}
          {!showForm ? (
            <>
              <button className="checkout-button" onClick={handleBuy}>
                Beli Sekarang
              </button>
              <button className="back-button" onClick={() => navigate(-1)}>
                Kembali
              </button>
            </>
          ) : (
            <form className="checkout-form" onSubmit={handlePayment}>
              <h3>Informasi Pelanggan</h3>
              <div className="form-group">
                <label htmlFor="name">Nama</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="checkout-button"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </button>
              <button
                type="button"
                className="back-button"
                onClick={() => setShowForm(false)}
              >
                Kembali
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
