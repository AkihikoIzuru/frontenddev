import "./Home.css"
import nusantaraBrewImage from "./homeAssets/nusantara-brew.png" // Pastikan gambar ada di folder yang sesuai
import nusantaraBrewImage2 from "./homeAssets/nusantara-brew2.png" // Pastikan gambar ada di folder yang sesuai
import { Link } from "react-router-dom"

export const Home = () => {
  return (
    <div className="Home">
      <h2>
        Selamat Datang <br />
        di Nusantara Brew!{" "}
      </h2>
      <p>
        Kami adalah toko yang menyediakan berbagai minuman dan camilan <br />
        tradisional Nusantara dengan sentuhan modern. Kami berkomitmen <br />
        untuk menyajikan producmdk-produk yang berkualitas tinggi dan lezat, <br />
        sehingga Anda dapat menikmati rasa Nusantara yang autentik. <br />
      </p>
      <Link to="/Product">
        <button className="order-button">Order Now</button>
      </Link>
      <div>
        <img src={nusantaraBrewImage} alt="Nusantara Brew" className="home-image" />
        <img src={nusantaraBrewImage2} alt="Nusantara Brew2" className="home-image2" />
      </div>
    </div>
  )
}
