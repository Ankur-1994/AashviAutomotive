import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // ✅ Fetch navigation data
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
    location.pathname === "/booking" ||
    location.pathname === "/contact" ||
    location.pathname === "/refer";

  const navClasses =
    isScrolled || isLightPage
      ? "bg-white shadow-lg text-[#0B3B74]"
      : "bg-transparent text-white";

  const brandShadow = !(isScrolled || isLightPage)
    ? "drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]"
    : "";

  return (
    <>
      {/* TOP NAVBAR */}
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-12 py-3 transition-all duration-500 ${navClasses}`}
      >
        {/* LEFT: Logo + Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform hover:scale-[1.02]"
        >
          <img
            src={navData.logo}
            alt="Aashvi Automotive Logo"
            className="h-9 md:h-11 rounded-md object-contain group-hover:opacity-90 transition-opacity"
          />

          <div className="text-lg md:text-xl font-medium tracking-wide flex items-center flex-wrap">
            <span className={`text-orange-500 ${brandShadow}`}>Aashvi</span>
            <span
              className={`ml-1 ${
                isScrolled || isLightPage ? "text-[#0B3B74]" : "text-white"
              } ${brandShadow}`}
            >
              Automotive
            </span>

            <span className="mx-2 text-gray-400 font-light">|</span>

            <span
              className={`font-semibold bg-gradient-to-r from-green-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent ${brandShadow}`}
            >
              Service Force
            </span>
          </div>
        </Link>

        {/* RIGHT: Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navData.links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-[15px] font-medium group ${
                  isActive
                    ? "text-orange-500"
                    : isScrolled || isLightPage
                    ? "text-[#0B3B74]"
                    : "text-white"
                }`}
              >
                <span
                  className={`group-hover:text-orange-500 transition-colors`}
                >
                  {language === "en" ? link.label_en : link.label_hi}
                </span>
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-orange-500 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all"
          >
            <HiOutlineGlobeAlt className="w-5 h-5" />
            {language === "en" ? "हिन्दी" : "EN"}
          </button>

          {/* WhatsApp */}
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

        {/* HAMBURGER ICON (MOBILE) */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>
      </motion.nav>

      {/* FULLSCREEN MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />

            {/* Fullscreen Menu */}
            <motion.div
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-gradient-to-b from-white via-[#FFF8F1] to-[#FFE7CC] text-[#0B3B74]"
            >
              {/* Close button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-5 right-5 text-3xl text-gray-700 hover:text-orange-500 transition"
              >
                <FaTimes />
              </button>

              {/* Top Section: Logo */}
              <div className="pt-12">
                <img
                  src={navData.logo}
                  alt="Aashvi Automotive"
                  className="h-12 mx-auto drop-shadow-md"
                />
              </div>

              {/* Center: Nav Links */}
              <div className="flex flex-col items-center space-y-5">
                {navData.links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`text-xl font-semibold tracking-wide transition-all duration-200 ${
                        isActive
                          ? "text-orange-500"
                          : "text-[#0B3B74] hover:text-orange-500 hover:scale-105"
                      }`}
                    >
                      {language === "en" ? link.label_en : link.label_hi}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom: Buttons */}
              <div className="w-full pb-12 flex flex-col items-center gap-3">
                <button
                  onClick={() => {
                    setLanguage(language === "en" ? "hi" : "en");
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-56 py-3 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all"
                >
                  <HiOutlineGlobeAlt className="w-5 h-5" />
                  {language === "en" ? "हिन्दी" : "EN"}
                </button>

                <a
                  href={`https://wa.me/${navData.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-56 py-3 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
                >
                  <FaWhatsapp />
                  {language === "en" ? "Chat on WhatsApp" : "व्हाट्सएप चैट"}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
