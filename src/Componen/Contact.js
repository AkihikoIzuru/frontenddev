"use client"

import { useState, useRef } from "react"
import "./Contact.css"
import { Instagram, Phone, Mail, MapPin, Send } from "lucide-react"
import emailjs from "@emailjs/browser"

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const formRef = useRef()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    emailjs
      .sendForm(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_PUBLIC_KEY,
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text)
          showToast("Message sent successfully! We'll get back to you soon.", "success")
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          })
        },
        (error) => {
          console.error("Email sending failed:", error.text)
          showToast("Failed to send message. Please try again later.", "error")
        },
      )
      .finally(() => {
        setLoading(false)
      })
  }

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
  }

  return (
    <div className="contact-container">
      <div className="contact-left">
        <h1 className="contact-title">Contact us</h1>
        <p className="contact-description">
          Temukan kenikmatan teh khas Nusantara bersama kami! Jika Anda memiliki pertanyaan, masukan, atau ingin
          menjalin kerja sama, jangan ragu untuk menghubungi kami melalui berbagai cara berikut:
        </p>

        <div className="contact-options">
          <div className="contact-option">
            <Mail className="contact-icon" size={20} />
            <a href="mailto:nusantarabrew@gmail.com" className="contact-link">
              nusantarabrew@gmail.com
            </a>
          </div>
          <div className="contact-option">
            <MapPin className="contact-icon" size={20} />
            <a
              href="https://maps.app.goo.gl/aQGTiUZgpkzCXmso9"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              Pucakwangi, Kec. Pagerruyung, Kabupaten Kendal, Jawa Tengah 51361
            </a>
          </div>
        </div>

        <div className="follow-us">
          <h3>Hubungi Kami</h3>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/defi_purwa/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="social-icon" size={24} />
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              <Phone className="social-icon" size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="contact-right">
        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Name"
              className="input-field"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Phone"
              className="input-field"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              className="input-field"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            placeholder="Message"
            className="textarea-field"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Sending..." : "Send message"} {!loading && <Send size={16} className="send-icon" />}
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      {toast.show && <div className={`contact-toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  )
}
