import "./Home.css";
import nusantaraBrewImage from "./homeAssets/nusantara-brew.png";
import nusantaraBrewImage2 from "./homeAssets/nusantara-brew2.png";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="Home">
      <div className="hero">
        <div className="home-title">
          <h2>
            Selamat Datang <br />
            di Nusantara Brew!{" "}
          </h2>
          <p>
            Kami adalah toko yang menyediakan berbagai minuman dan camilan
            tradisional Nusantara dengan sentuhan modern. Kami berkomitmen untuk
            menyajikan produk-produk yang berkualitas tinggi dan lezat, sehingga
            Anda dapat menikmati rasa Nusantara yang autentik.
          </p>
          <Link to="/Product">
            <button className="order-button">Order Now</button>
          </Link>
        </div>

        <div className="home-image-wrap">
          <img
            src={nusantaraBrewImage || "/placeholder.svg"}
            alt="Nusantara Brew"
            className="home-image"
          />
          <img
            src={nusantaraBrewImage2 || "/placeholder.svg"}
            alt="Nusantara Brew2"
            className="home-image2"
          />
        </div>
      </div>
    </div>
  );
};
