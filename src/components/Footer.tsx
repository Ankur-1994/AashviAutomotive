import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

interface FooterProps {
  language: "en" | "hi";
}

interface SiteMeta {
  name_en: string;
  name_hi: string;
  tagline_en: string;
  tagline_hi: string;
  address_hi: string;
  address_en: string;
  description_en: string;
  description_hi: string;
  email: string;
  phone: string;
  businessWhatsApp: string;
  logo_url: string;
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

const Footer = ({ language }: FooterProps) => {
  const [meta, setMeta] = useState<SiteMeta | null>(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const snap = await getDoc(doc(db, "content", "site_meta"));
        if (snap.exists()) setMeta(snap.data() as SiteMeta);
      } catch (err) {
        console.error("Error loading footer meta:", err);
      }
    };
    fetchMeta();
  }, []);

  if (!meta) return null;

  const isEn = language === "en";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#0B3B74] via-[#0B3B74]/90 to-black text-gray-200 py-14 px-6 md:px-20 mt-10 overflow-hidden">
      {/* Subtle glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-900/10 rounded-full blur-3xl"></div>

      {/* Footer grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 relative z-10">
        {/* --- Column 1: About --- */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={meta.logo_url}
              alt={isEn ? meta.name_en : meta.name_hi}
              className="h-12 w-12 object-contain rounded-md"
            />
            <h3 className="text-xl tracking-wide">
              <span className="text-orange-400">
                {isEn ? meta.name_en.split(" ")[0] : meta.name_hi.split(" ")[0]}
              </span>{" "}
              <span className="text-blue-100">
                {isEn ? meta.name_en.split(" ")[1] : meta.name_hi.split(" ")[1]}
              </span>
            </h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            {isEn ? meta.description_en : meta.description_hi}
          </p>
          <p className="text-xs italic text-gray-400">
            {isEn ? meta.tagline_en : meta.tagline_hi}
          </p>
        </div>

        {/* --- Column 2: Quick Links --- */}
        <div>
          <h3 className="text-lg font-semibold text-orange-400 mb-3">
            {isEn ? "Quick Links" : "त्वरित लिंक"}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-orange-400 transition-colors">
                {isEn ? "Home" : "मुखपृष्ठ"}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-orange-400 transition-colors"
              >
                {isEn ? "About Us" : "हमारे बारे में"}
              </Link>
            </li>
            <li>
              <Link
                to="/booking"
                className="hover:text-orange-400 transition-colors"
              >
                {isEn ? "Booking" : "बुकिंग"}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-orange-400 transition-colors"
              >
                {isEn ? "Contact" : "संपर्क करें"}
              </Link>
            </li>
          </ul>
        </div>

        {/* --- Column 3: Contact --- */}
        <div>
          <h3 className="text-lg font-semibold text-orange-400 mb-3">
            {isEn ? "Reach Us" : "हमसे संपर्क करें"}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-orange-400 mt-1" />
              <span>
                {language === "en" ? meta.address_en : meta.address_hi}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-orange-400" />
              <a href={`tel:${meta.phone}`} className="hover:underline">
                {meta.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-orange-400" />
              <a href={`mailto:${meta.email}`} className="hover:underline">
                {meta.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaWhatsapp className="text-green-500" />
              <a
                href={`https://wa.me/${meta.businessWhatsApp.replace(
                  /\D/g,
                  ""
                )}?text=Hello%20Aashvi%20Automotive%2C%20I%20would%20like%20to%20book%20a%20bike%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {isEn ? "Chat on WhatsApp" : "व्हाट्सएप पर चैट करें"}
              </a>
            </li>
          </ul>

          {/* Social */}
          <div className="flex space-x-4 mt-5 text-lg">
            {meta.social.facebook && (
              <a
                href={meta.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-orange-400 transition-colors"
              >
                <FaFacebookF />
              </a>
            )}
            {meta.social.instagram && (
              <a
                href={meta.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-orange-400 transition-colors"
              >
                <FaInstagram />
              </a>
            )}
            {meta.social.youtube && (
              <a
                href={meta.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-orange-400 transition-colors"
              >
                <FaYoutube />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* --- Bottom Copyright --- */}
      <div className="mt-12 border-t border-gray-700 pt-4 text-center text-xs text-gray-400 relative z-10">
        © {currentYear} {isEn ? meta.name_en : meta.name_hi}.{" "}
        {isEn ? "All Rights Reserved." : "सर्वाधिकार सुरक्षित।"}
      </div>
    </footer>
  );
};

export default Footer;
