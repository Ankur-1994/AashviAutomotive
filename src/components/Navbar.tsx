// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

interface LinkItem {
  label_en: string;
  label_hi: string;
  path: string;
  order: number;
  show: boolean;
}

interface NavigationData {
  logo: string;
  whatsapp: string;
  links: LinkItem[];
}

interface NavbarProps {
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
}

const Navbar = ({ language, setLanguage }: NavbarProps) => {
  const [navData, setNavData] = useState<NavigationData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // ✅ Fetch navigation data from Firebase
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const docRef = doc(db, "content", "navigation");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as NavigationData;
          data.links = data.links
            .filter((link) => link.show)
            .sort((a, b) => a.order - b.order);
          setNavData(data);
        }
      } catch (err) {
        console.error("Failed to fetch navigation:", err);
      }
    };
    fetchNavData();
  }, []);

  // ✅ Track scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!navData) return null;

  const isLightPage =
    location.pathname === "/booking" || location.pathname === "/contact";

  const navClasses =
    isScrolled || isLightPage
      ? "bg-white shadow-lg text-[#0B3B74]"
      : "bg-transparent text-white";

  const brandShadow = !(isScrolled || isLightPage)
    ? "drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]"
    : "";

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 py-3 transition-all duration-500 ${navClasses}`}
    >
      {/* Left: Logo + Brand (clickable) */}
      <Link
        to="/"
        className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
      >
        <img
          src={navData.logo}
          alt="Aashvi Automotive Logo"
          className="h-10 md:h-12 rounded-md object-contain group-hover:opacity-90 transition-opacity"
        />

        {/* Brand Text */}
        <div className="text-xl md:text-2xl font-normal tracking-wide flex items-center">
          <span className={`text-orange-500 ${brandShadow}`}>Aashvi</span>
          <span
            className={`ml-1 ${
              isScrolled || isLightPage ? "text-[#0B3B74]" : "text-white"
            } ${brandShadow}`}
          >
            Automotive
          </span>
        </div>
      </Link>

      {/* Right: Nav Links + Buttons */}
      <div className="flex items-center space-x-6 md:space-x-10">
        {navData.links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="relative text-[15px] font-medium group"
          >
            <span
              className={`${
                isScrolled || isLightPage ? "text-[#0B3B74]" : "text-white"
              } group-hover:text-orange-500 transition-colors`}
            >
              {language === "en" ? link.label_en : link.label_hi}
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-300" />
          </Link>
        ))}

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all"
        >
          <HiOutlineGlobeAlt className="w-5 h-5" />
          {language === "en" ? "हिन्दी" : "EN"}
        </button>

        {/* WhatsApp Chat */}
        <a
          href={`https://wa.me/${navData.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
        >
          <FaWhatsapp />
          {language === "en" ? "Chat" : "चैट"}
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
