import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

interface FooterProps {
  language: "en" | "hi";
}

const Footer = ({ language }: FooterProps) => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-xl font-semibold text-orange-400 mb-3">
            {language === "en"
              ? "About Aashvi Automotive"
              : "आश्वी ऑटोमोटिव के बारे में"}
          </h3>
          <p className="text-sm leading-relaxed">
            {language === "en"
              ? "We are a trusted multibrand 2-wheeler service center in Rajnagar, Madhubani — providing repair, maintenance, and detailing services with quality and care."
              : "हम राजनगर, मधुबनी में एक भरोसेमंद मल्टीब्रांड 2-व्हीलर सर्विस सेंटर हैं — रिपेयर, मेंटेनेंस और डिटेलिंग सेवाएँ गुणवत्ता और विश्वास के साथ प्रदान करते हैं।"}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-orange-400 mb-3">
            {language === "en" ? "Quick Links" : "त्वरित लिंक"}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-orange-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-400">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-orange-400">
                Booking
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-orange-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-orange-400 mb-3">
            {language === "en" ? "Contact Us" : "संपर्क करें"}
          </h3>
          <p className="text-sm">📍 Rajnagar, Madhubani, Bihar</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm">📧 info@aashviautomotive.in</p>

          {/* Social */}
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" className="hover:text-orange-400">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" className="hover:text-orange-400">
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/919876543210"
              className="hover:text-orange-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Aashvi Automotive. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
