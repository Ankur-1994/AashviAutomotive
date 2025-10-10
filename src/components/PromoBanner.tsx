import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

interface PromoData {
  cta_text: string;
  desc_en: string;
  desc_hi: string;
  image: string;
  title_en: string;
  title_hi: string;
  link?: string;
  active?: boolean;
}

interface PromoBannerProps {
  language: "en" | "hi";
}

const PromoBanner = ({ language }: PromoBannerProps) => {
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  // ✅ Fetch promos from Firebase
  useEffect(() => {
    let active = true;

    const fetchPromos = async () => {
      try {
        // ✅ Lazy-load Firebase Firestore
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy-load Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const docRef = doc(db, "content", "promos");
        const docSnap = await getDoc(docRef);

        if (!active || !docSnap.exists()) return;

        const data = docSnap.data();
        if (Array.isArray(data.banners)) {
          const activePromos = data.banners.filter(
            (b: PromoData) => b.active !== false
          );
          setPromos(activePromos);

          // ✅ Cache for quick future loads
          sessionStorage.setItem("promos_data", JSON.stringify(activePromos));
        }
      } catch (error) {
        console.error("Error fetching promo banners:", error);
      }
    };

    // ✅ Try to load from cache first
    const cached = sessionStorage.getItem("promos_data");
    if (cached) {
      setPromos(JSON.parse(cached));
    } else {
      fetchPromos();
    }

    return () => {
      active = false;
    };
  }, []);

  // ✅ Auto-rotate promos + progress bar
  useEffect(() => {
    if (promos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
      setProgress(0);
    }, 6000);

    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 2 : 100));
    }, 120); // ~6s = 100%

    return () => {
      clearInterval(interval);
      clearInterval(progressTimer);
    };
  }, [promos.length]);

  if (!visible || !promos.length) return null;

  const promo = promos[currentIndex];
  const [ctaEn, ctaHi] = promo.cta_text
    ? promo.cta_text.split("/").map((s) => s.trim())
    : ["Book Now", "अभी बुक करें"];

  const ctaLabel = language === "en" ? ctaEn : ctaHi;
  const linkTo = promo.link || "/booking";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="promo-banner"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="
        fixed z-50
        bottom-4 sm:bottom-6
        left-4 sm:left-6
        w-[92vw] sm:w-[300px] md:w-[340px]
        bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden
        border border-orange-200
      "
        >
          {/* ✅ Close button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full transition-all z-20"
            aria-label="Close Promo"
          >
            <FaTimes size={14} />
          </button>

          {/* ✅ Promo Image */}
          <div
            className="w-full h-28 sm:h-32 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${promo.image})` }}
          >
            {promos.length > 1 && (
              <div className="absolute top-0 left-0 w-full h-1 bg-white/40">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* ✅ Text Content */}
          <div className="p-3 sm:p-4 text-center text-gray-800">
            <h3 className="text-base sm:text-lg font-semibold text-orange-600 mb-1 leading-snug">
              {language === "en" ? promo.title_en : promo.title_hi}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-normal">
              {language === "en" ? promo.desc_en : promo.desc_hi}
            </p>

            <Link
              to={linkTo}
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium shadow-md transition-transform hover:scale-[1.05]"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* ✅ Slide Dots */}
          {promos.length > 1 && (
            <div className="flex justify-center items-center space-x-2 pb-3">
              {promos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setProgress(0);
                  }}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-orange-500 scale-110"
                      : "bg-gray-400 hover:bg-orange-400"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoBanner;
