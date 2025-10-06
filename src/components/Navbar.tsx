// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { FiMenu, FiX } from "react-icons/fi";

interface NavbarProps {
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
}

interface NavLinkItem {
  path: string;
  label_en: string;
  label_hi: string;
  order?: number;
  show?: boolean;
  external?: boolean;
  target?: string;
}

const fallbackLinks: NavLinkItem[] = [
  { path: "/", label_en: "Home", label_hi: "मुखपृष्ठ", order: 1 },
  { path: "/about", label_en: "About", label_hi: "हमारे बारे में", order: 2 },
  { path: "/booking", label_en: "Booking", label_hi: "बुकिंग", order: 3 },
  { path: "/contact", label_en: "Contact", label_hi: "संपर्क करें", order: 4 },
];

const Navbar = ({ language, setLanguage }: NavbarProps) => {
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(fallbackLinks);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [siteName, setSiteName] = useState<string>("Aashvi Automotive");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Scroll background toggle
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Subscribe to navigation doc (real-time)
  useEffect(() => {
    const navRef = doc(db, "content", "navigation");
    const unsubNav = onSnapshot(
      navRef,
      (snap) => {
        if (!snap.exists()) {
          setNavLinks(fallbackLinks);
          return;
        }
        const data = snap.data() as any;
        const raw: NavLinkItem[] = Array.isArray(data.links) ? data.links : [];
        const filtered = raw
          .filter((l) => l.show !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setNavLinks(filtered.length ? filtered : fallbackLinks);
      },
      (err) => {
        console.error("nav onSnapshot error:", err);
        setNavLinks(fallbackLinks);
      }
    );
    return () => unsubNav();
  }, []);

  // Subscribe to site_meta for logo + site name (real-time)
  useEffect(() => {
    const metaRef = doc(db, "content", "site_meta");
    const unsubMeta = onSnapshot(
      metaRef,
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as any;
        setLogoUrl(data.logo_url ?? "");
        setSiteName(
          language === "en"
            ? data.name_en ?? data.siteTitle_en ?? "Aashvi Automotive"
            : data.name_hi ?? data.siteTitle_hi ?? "आश्वी ऑटोमोटिव"
        );
      },
      (err) => console.error("site_meta onSnapshot error:", err)
    );
    return () => unsubMeta();
  }, [language]);

  const renderLink = (link: NavLinkItem) => {
    const label = language === "en" ? link.label_en : link.label_hi;
    const isActive = !link.external && location.pathname === link.path;

    if (link.external) {
      return (
        <a
          href={link.path}
          key={link.path}
          target={link.target ?? "_blank"}
          rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
          className={`transition-colors ${
            isActive ? "text-orange-400" : "text-white/95"
          } hover:text-orange-300`}
        >
          {label}
        </a>
      );
    }

    return (
      <Link
        key={link.path}
        to={link.path}
        onClick={() => setMenuOpen(false)}
        className={`transition-colors ${
          isActive
            ? "text-orange-400 border-b-2 border-orange-400 pb-1"
            : "text-white/95 hover:text-orange-300"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 top-0 transition-all ${
        isScrolled
          ? "backdrop-blur-md bg-[#0B3B74]/95 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        {/* Left: logo + name */}
        <Link to="/" className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Aashvi Automotive"
              className="h-10 md:h-12 object-contain rounded-md shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 bg-white/10 rounded-md animate-pulse" />
          )}
          <span className="text-white font-semibold">{siteName}</span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((l) => renderLink(l))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            aria-label="Toggle language"
            className="px-3 py-1 rounded-lg bg-white/10 text-white hover:bg-orange-500 transition"
          >
            {language === "en" ? "हिंदी" : "EN"}
          </button>

          <Link
            to="/booking"
            className="hidden md:inline-block bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 rounded-full text-white font-semibold shadow"
          >
            {language === "en" ? "Book Service" : "सर्विस बुक करें"}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Open menu"
            className="md:hidden p-2 rounded text-white"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B3B74]/95 backdrop-blur-lg">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((l) => (
              <div key={l.path} className="text-lg">
                {l.external ? (
                  <a
                    href={l.path}
                    target={l.target ?? "_blank"}
                    rel="noopener noreferrer"
                    className="text-white/95 block"
                    onClick={() => setMenuOpen(false)}
                  >
                    {language === "en" ? l.label_en : l.label_hi}
                  </a>
                ) : (
                  <Link
                    to={l.path}
                    onClick={() => setMenuOpen(false)}
                    className="text-white/95 block"
                  >
                    {language === "en" ? l.label_en : l.label_hi}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setLanguage(language === "en" ? "hi" : "en");
                  setMenuOpen(false);
                }}
                className="bg-white/10 px-3 py-1 rounded"
              >
                {language === "en" ? "हिंदी" : "EN"}
              </button>
              <Link
                to="/booking"
                onClick={() => setMenuOpen(false)}
                className="bg-orange-500 px-4 py-1 rounded text-white"
              >
                {language === "en" ? "Book Service" : "सर्विस बुक करें"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
