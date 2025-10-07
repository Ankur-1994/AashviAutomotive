// src/components/PromoBanner.tsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
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
    const fetchPromos = async () => {
      try {
        const docRef = doc(db, "content", "promos");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.banners)) {
            const activePromos = data.banners.filter(
              (b: PromoData) => b.active !== false
            );
            setPromos(activePromos);
          }
        }
      } catch (error) {
        console.error("Error fetching promo banners:", error);
      }
    };
    fetchPromos();
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
      <motion.div
        key="promo-banner"
        initial={{ opacity: 0, x: -50, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed bottom-6 left-6 z-50 w-[300px] md:w-[360px] bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-orange-200"
      >
        {/* ✅ Close button — visible & accessible */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all z-20"
          aria-label="Close Promo"
        >
          <FaTimes size={14} />
        </button>

        {/* Promo Image with progress bar */}
        <div
          className="w-full h-32 bg-cover bg-center relative"
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

        {/* Promo Text Content */}
        <div className="p-4 text-center text-gray-800">
          <h3 className="text-lg md:text-xl font-semibold text-orange-600 mb-1">
            {language === "en" ? promo.title_en : promo.title_hi}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {language === "en" ? promo.desc_en : promo.desc_hi}
          </p>
          <Link
            to={linkTo}
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform hover:scale-[1.05]"
          >
            {ctaLabel}
          </Link>
        </div>

        {/* ✅ Slide Dots — indicator + control */}
        {promos.length > 1 && (
          <div className="flex justify-center items-center space-x-2 pb-3">
            {promos.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setProgress(0);
                }}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === currentIndex
                    ? "bg-orange-500 scale-110"
                    : "bg-gray-400 hover:bg-orange-400"
                } transition-all`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBanner;
