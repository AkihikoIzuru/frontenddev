"use client";

import "./CO.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const CO = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state || JSON.parse(localStorage.getItem("product"));
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Save product to localStorage
    if (product) {
      localStorage.setItem("product", JSON.stringify(product));
    }

    // Load Midtrans Snap script
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.REACT_APP_MIDTRANS_CLIENT_KEY
    );
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [product]);

  if (!product) {
    return <p className="error-message">Tidak ada produk yang dipilih.</p>;
  }

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const calculateTotal = () => {
    const basePrice = product.price;
    return basePrice * quantity;
  };

  const handleBuy = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        product_id: product._id,
        product_name: product.name,
        amount: calculateTotal(),
        quantity: quantity,
        first_name: customerInfo.name,
      };

      // Call your backend to create a transaction
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/transactions`,
        orderData
      );

      // Open Snap payment page
      window.snap.pay(response.data.midtrans_url, {
        onSuccess: (result) => {
          alert("Payment success!");
          console.log(result);
          navigate("/");
        },
        onPending: (result) => {
          alert("Payment pending!");
        },
        onError: (result) => {
          alert("Payment failed!");
        },
        onClose: () => {
          alert("You closed the payment window without completing the payment");
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <img
          src={product.thumbnail || "/placeholder.svg"}
          alt={product.name}
          className="checkout-image"
        />
        <div className="checkout-details">
          <h2 className="checkout-product-name">{product.name}</h2>
          <p className="checkout-description">{product.description}</p>

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

          <div className="checkout-total">
            <p>Total: Rp {calculateTotal().toLocaleString()}</p>
          </div>

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
              <h3>Customer Information</h3>
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
                {loading ? "Processing..." : "Bayar Sekarang"}
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
