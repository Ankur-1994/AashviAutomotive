// src/components/PromoBanner.tsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

  // 🔹 Fetch promos once from Firestore
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

  // 🔹 Auto-slide every 5s
  useEffect(() => {
    if (promos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promos.length]);

  if (!promos.length) return null;

  const promo = promos[currentIndex];
  const [ctaEn, ctaHi] = promo.cta_text
    ? promo.cta_text.split("/").map((s) => s.trim())
    : [promo.cta_text, promo.cta_text];
  const ctaLabel =
    language === "en" ? ctaEn || "Book Now" : ctaHi || "अभी बुक करें";
  const linkTo = promo.link || "/booking";

  return (
    <section className="relative my-12 md:my-20 max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-lg">
      {/* Navigation Arrows */}
      {promos.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + promos.length) % promos.length
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10 transition"
            aria-label="Previous banner"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % promos.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10 transition"
            aria-label="Next banner"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Banner Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[250px] md:h-[380px]"
        >
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${promo.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-snug drop-shadow-lg">
              {language === "en" ? promo.title_en : promo.title_hi}
            </h2>
            <p className="text-sm md:text-base text-gray-200 mb-4">
              {language === "en" ? promo.desc_en : promo.desc_hi}
            </p>
            <Link
              to={linkTo}
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-transform hover:scale-[1.05]"
            >
              {ctaLabel}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      {promos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {promos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === currentIndex ? "bg-orange-500" : "bg-white/50"
              }`}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PromoBanner;
