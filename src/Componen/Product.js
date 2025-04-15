"use client"

import "./Product.css"
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

export const Product = () => {
  const scrollRef = useRef(null)
  const scrollAmount = 300
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`https://backenddev-six.vercel.app/api/products`)
      setProducts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery))

  const handleCheckout = (product) => {
    navigate("/checkout", { state: product })
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="container">
      <h1 className="title">Nusantara Brew</h1>
      <p className="subtitle">Cemilan dan Minuman Teh Nusantara</p>

      <div className="scroll-wrapper">
        <button className="scroll-btn left" onClick={scrollLeft} aria-label="Scroll left">
          &#10094;
        </button>

        <div className="grid-container" ref={scrollRef}>
          {loading ? (
            <p>Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div key={index} className="product-wrapper">
                <div className="product-card">
                  <div className="product-image-container">
                    <img src={product.thumbnail || "/placeholder.svg"} alt={product.name} className="product-image" />
                  </div>
                  <button className="product-name" onClick={() => handleCheckout(product)}>
                    {product.name}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-result">Produk tidak ditemukan</p>
          )}
        </div>

        <button className="scroll-btn right" onClick={scrollRight} aria-label="Scroll right">
          &#10095;
        </button>
      </div>
    </div>
  )
}
