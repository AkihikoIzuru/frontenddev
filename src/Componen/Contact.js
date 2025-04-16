import { useState, useRef } from "react";
import "./Contact.css";
import { Instagram, Phone, Mail, MapPin, Send } from "lucide-react";
import emailjs from "@emailjs/browser";

export const Contact = () => {
  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // State untuk loading indicator saat mengirim form
  const [loading, setLoading] = useState(false);

  // State untuk toast notification
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Ref untuk form element
  const formRef = useRef();

  // Handler untuk perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mengirim email menggunakan EmailJS
    emailjs
      .sendForm(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_PUBLIC_KEY
      )
      .then(
        (result) => {
          // Jika sukses, reset form dan tampilkan toast
          console.log("Email sent successfully:", result.text);
          showToast(
            "Message sent successfully! We'll get back to you soon.",
            "success"
          );
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          // Jika gagal, tampilkan error toast
          console.error("Email sending failed:", error.text);
          showToast("Failed to send message. Please try again later.", "error");
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  // Fungsi untuk menampilkan toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    // Toast akan hilang setelah 3 detik
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  return (
    <div className="contact-container">
      {/* Bagian kiri - Informasi kontak */}
      <div className="contact-left">
        <h1 className="contact-title">Contact us</h1>
        <p className="contact-description">
          Temukan kenikmatan teh khas Nusantara bersama kami! Jika Anda memiliki
          pertanyaan, masukan, atau ingin menjalin kerja sama, jangan ragu untuk
          menghubungi kami melalui berbagai cara berikut:
        </p>

        {/* Opsi kontak via email dan alamat */}
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

        {/* Social media links */}
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
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="social-icon" size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bagian kanan - Form kontak */}
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
            {loading ? "Sending..." : "Send message"}{" "}
            {!loading && <Send size={16} className="send-icon" />}
          </button>
        </form>
      </div>

      {/* Toast Notification - Muncul saat pengiriman form berhasil/gagal */}
      {toast.show && (
        <div className={`contact-toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};
