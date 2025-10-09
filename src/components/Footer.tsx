import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGavel,
  FaShieldAlt,
  FaUndoAlt,
  FaSitemap,
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
  const isEn = language === "en";
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let active = true;

    const fetchMeta = async () => {
      try {
        // ✅ Lazy-load Firestore only when needed
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy import Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const snap = await getDoc(doc(db, "content", "site_meta"));
        if (!active || !snap.exists()) return;

        const data = snap.data() as SiteMeta;
        setMeta(data);

        // ✅ Cache for faster subsequent loads
        sessionStorage.setItem("site_meta_data", JSON.stringify(data));
      } catch (err) {
        console.error("Error loading footer meta:", err);
      }
    };

    // ✅ Use cached data if available
    const cached = sessionStorage.getItem("site_meta_data");
    if (cached) {
      setMeta(JSON.parse(cached));
    } else {
      fetchMeta();
    }

    return () => {
      active = false;
    };
  }, []);

  if (!meta) return null;

  return (
    <footer className="relative bg-gradient-to-b from-[#0B3B74] via-[#0B3B74]/90 to-black text-gray-200 py-14 px-6 md:px-20 mt-10 overflow-hidden">
      {/* Gradient glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-900/10 rounded-full blur-3xl"></div>

      {/* Grid layout */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
        {/* --- Column 1: About --- */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={meta.logo_url}
              alt={isEn ? meta.name_en : meta.name_hi}
              className="h-12 w-12 object-contain rounded-md"
            />
            <h3 className="text-xl tracking-wide font-semibold">
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
            {[
              { to: "/", label: "Home", hi: "मुखपृष्ठ" },
              { to: "/about", label: "About Us", hi: "हमारे बारे में" },
              { to: "/services", label: "Services", hi: "सेवाएं" },
              { to: "/booking", label: "Booking", hi: "बुकिंग" },
              { to: "/contact", label: "Contact", hi: "संपर्क करें" },
              { to: "/faqs", label: "FAQs", hi: "अक्सर पूछे जाने वाले सवाल" },
              { to: "/refer", label: "Refer & Earn", hi: "रेफर करें और कमाएं" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-orange-400 transition-colors"
                >
                  {isEn ? link.label : link.hi}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Column 3: Legal Links --- */}
        <div>
          <h3 className="text-lg font-semibold text-orange-400 mb-3">
            {isEn ? "Legal & Policies" : "कानूनी और नीतियाँ"}
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaGavel className="text-orange-400" />
              <Link to="/terms" className="hover:text-orange-400">
                {isEn ? "Terms & Conditions" : "नियम व शर्तें"}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaShieldAlt className="text-orange-400" />
              <Link to="/privacy" className="hover:text-orange-400">
                {isEn ? "Privacy Policy" : "गोपनीयता नीति"}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaUndoAlt className="text-orange-400" />
              <Link to="/refunds" className="hover:text-orange-400">
                {isEn ? "Refund & Cancellation" : "रिफंड और रद्दीकरण नीति"}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaSitemap className="text-orange-400" />
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400"
              >
                {isEn ? "Sitemap" : "साइटमैप"}
              </a>
            </li>
          </ul>
        </div>

        {/* --- Column 4: Contact Info --- */}
        <div>
          <h3 className="text-lg font-semibold text-orange-400 mb-3">
            {isEn ? "Reach Us" : "हमसे संपर्क करें"}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-orange-400 mt-1" />
              <span>{isEn ? meta.address_en : meta.address_hi}</span>
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

      {/* Bottom bar */}
      <div className="mt-12 border-t border-gray-700 pt-4 text-center text-xs text-gray-400 relative z-10">
        © {currentYear} {isEn ? meta.name_en : meta.name_hi}.{" "}
        {isEn ? "All Rights Reserved." : "सर्वाधिकार सुरक्षित।"} <br />
        <span className="text-[11px] text-gray-500">
          {isEn
            ? "Authorized Franchise Partner — Service Force India"
            : "अधिकृत फ्रेंचाइज़ पार्टनर — सर्विस फोर्स इंडिया"}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
