import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

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

  useEffect(() => {
    let active = true;
    const fetchNavData = async () => {
      try {
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "content", "navigation");
        const docSnap = await getDoc(docRef);
        if (!active || !docSnap.exists()) return;

        const data = docSnap.data() as NavigationData;
        data.links = data.links
          .filter((link) => link.show)
          .sort((a, b) => a.order - b.order);
        setNavData(data);
        sessionStorage.setItem("navigation_data", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch navigation:", err);
      }
    };

    const cached = sessionStorage.getItem("navigation_data");
    if (cached) setNavData(JSON.parse(cached));
    else fetchNavData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!navData) return null;

  const isLightPage = [
    "/booking",
    "/contact",
    "/refer",
    "/services",
    "/faqs",
    "/terms",
    "/privacy",
    "/refunds",
  ].includes(location.pathname);

  const navClasses =
    isScrolled || isLightPage
      ? "bg-white shadow-lg text-[#0B3B74]"
      : "bg-transparent text-white";

  const brandShadow = !(isScrolled || isLightPage)
    ? "drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]"
    : "";

  return (
    <>
      {/* ✅ MAIN NAVBAR */}
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 transition-all duration-500 ${navClasses}`}
      >
        {/* ✅ LEFT: Logo + Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform hover:scale-[1.02] shrink-0"
        >
          <img
            src={navData.logo}
            alt="Aashvi Automotive Logo"
            className="h-8 sm:h-9 md:h-11 rounded-md object-contain group-hover:opacity-90 transition-opacity"
          />

          <div className="flex flex-col sm:flex-row sm:items-center text-[13px] sm:text-sm md:text-base lg:text-lg font-medium tracking-wide leading-tight sm:leading-none text-left sm:text-left">
            <div className="flex items-center flex-wrap justify-start">
              <span className={`text-orange-500 ${brandShadow}`}>Aashvi</span>
              <span
                className={`ml-1 ${
                  isScrolled || isLightPage ? "text-[#0B3B74]" : "text-white"
                } ${brandShadow}`}
              >
                Automotive
              </span>
            </div>

            <div className="flex items-center justify-start mt-[2px] sm:mt-0">
              <span className="hidden sm:inline-block mx-2 text-gray-400 font-light">
                |
              </span>
              <span
                className={`font-semibold bg-gradient-to-r from-green-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent ${brandShadow}`}
              >
                Service Force
              </span>
            </div>
          </div>
        </Link>

        {/* ✅ DESKTOP NAV LINKS */}
        <div className="hidden xl:flex items-center space-x-6 xl:space-x-8">
          {navData.links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-[15px] font-medium group whitespace-nowrap ${
                  isActive
                    ? "text-orange-500"
                    : isScrolled || isLightPage
                    ? "text-[#0B3B74]"
                    : "text-white"
                }`}
              >
                <span className="group-hover:text-orange-500 transition-colors">
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
            href={`https://wa.me/${navData.whatsapp.replace(
              /\D/g,
              ""
            )}?text=Hello%20Aashvi%20Automotive%2C%20I%20want%20to%20book%20a%20bike%20service.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            <FaWhatsapp />
            {language === "en" ? "Chat" : "चैट"}
          </a>
        </div>

        {/* ✅ RIGHT SECTION — Language toggle + Hamburger (for small & medium screens) */}
        <div className="flex items-center gap-3">
          {/* 🌐 Language Toggle — visible on sm to lg screens */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex xl:hidden items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all"
          >
            <HiOutlineGlobeAlt className="w-4 h-4" />
            {language === "en" ? "हिन्दी" : "EN"}
          </button>

          {/* 🍔 Hamburger Icon */}
          <button
            className="xl:hidden text-2xl focus:outline-none text-inherit"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
          >
            <FaBars />
          </button>
        </div>
      </motion.nav>

      {/* ✅ MOBILE / TABLET MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            {/* Fullscreen Menu */}
            <motion.div
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-gradient-to-b from-[#FFFDF8] via-[#FFF5E6] to-[#FFE9C2] text-[#0B3B74]"
            >
              {/* ✅ BRANDED HEADER BAR */}
              <div className="relative w-full bg-gradient-to-r from-orange-50 via-white to-orange-50 shadow-sm flex items-center justify-center py-4 border-b border-orange-100">
                <img
                  src={navData.logo}
                  alt="Aashvi Automotive"
                  className="h-14 sm:h-16 mx-auto drop-shadow-md"
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute right-5 text-3xl text-gray-700 hover:text-orange-500 transition"
                  aria-label="Close Menu"
                >
                  <FaTimes />
                </button>
              </div>

              {/* ✅ MENU LINKS */}
              <div className="flex flex-col items-center space-y-4 w-full max-w-xs px-6">
                {navData.links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`w-full text-center py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-orange-500 text-white shadow-md scale-105"
                          : "bg-white text-[#0B3B74] hover:bg-orange-100 hover:text-orange-600"
                      }`}
                    >
                      {language === "en" ? link.label_en : link.label_hi}
                    </Link>
                  );
                })}
              </div>

              {/* ✅ BOTTOM BUTTONS */}
              <div className="w-full pb-10 flex flex-col items-center gap-3">
                <button
                  onClick={() => {
                    setLanguage(language === "en" ? "hi" : "en");
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-52 sm:w-56 py-3 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md"
                >
                  <HiOutlineGlobeAlt className="w-5 h-5" />
                  {language === "en" ? "हिन्दी" : "EN"}
                </button>

                <a
                  href={`https://wa.me/${navData.whatsapp.replace(
                    /\D/g,
                    ""
                  )}?text=Hello%20Aashvi%20Automotive%2C%20I%20want%20to%20book%20a%20bike%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-52 sm:w-56 py-3 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all shadow-md"
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
