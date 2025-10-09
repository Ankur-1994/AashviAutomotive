import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";

interface Testimonial {
  name: string;
  rating: number;
  review_en: string;
  review_hi: string;
}

interface TestimonialsContent {
  title_en: string;
  title_hi: string;
  subtitle_en: string;
  subtitle_hi: string;
  reviews: Testimonial[];
}

interface TestimonialsSectionProps {
  language: "en" | "hi";
}

const TestimonialsSection = ({ language }: TestimonialsSectionProps) => {
  const [data, setData] = useState<TestimonialsContent | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔹 Fetch from Firebase
  useEffect(() => {
    let active = true;

    const fetchTestimonials = async () => {
      try {
        // ✅ Lazy-load Firebase Firestore instance
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy import Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const snap = await getDoc(doc(db, "content", "testimonials"));
        if (!active || !snap.exists()) return;

        const data = snap.data() as TestimonialsContent;
        setData(data);

        // ✅ Cache for faster subsequent loads
        sessionStorage.setItem("testimonials_data", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };

    // ✅ Use cached data first (instant paint)
    const cached = sessionStorage.getItem("testimonials_data");
    if (cached) {
      setData(JSON.parse(cached));
    } else {
      fetchTestimonials();
    }

    return () => {
      active = false;
    };
  }, []);

  // 🔹 Auto slide
  useEffect(() => {
    if (!data?.reviews?.length) return;
    const id = setInterval(
      () => setActiveIndex((p) => (p + 1) % data.reviews.length),
      7000
    );
    return () => clearInterval(id);
  }, [data?.reviews?.length]);

  if (!data || !data.reviews?.length) return null;
  const t = data.reviews[activeIndex];

  return (
    <section className="relative py-24 px-6 md:px-20 bg-gradient-to-br from-[#0B3B74]/90 via-[#0B3B74]/70 to-white overflow-hidden text-white">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_bottom_right,rgba(255,102,0,0.12),transparent_70%)]" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* LEFT: Section title and subtitle (from Firebase) */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug text-white">
            {language === "en" ? data.title_en : data.title_hi}
          </h2>
          <p className="text-blue-100 max-w-md mx-auto md:mx-0 leading-relaxed">
            {language === "en" ? data.subtitle_en : data.subtitle_hi}
          </p>
        </div>

        {/* RIGHT: Rotating testimonial card */}
        <div className="flex-1 relative w-full md:w-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6 }}
              className="relative bg-white text-gray-900 rounded-3xl shadow-2xl border border-blue-100 p-10 w-full mx-auto overflow-hidden"
            >
              {/* Review content */}
              <p className="text-gray-700 italic text-base md:text-lg leading-relaxed mb-6">
                “{language === "en" ? t.review_en : t.review_hi}”
              </p>

              <div className="flex justify-center mb-2 text-orange-500">
                {Array.from({ length: 5 }).map((_, i) =>
                  i < t.rating ? <FaStar key={i} /> : null
                )}
              </div>

              <h4 className="text-[#0B3B74] font-semibold text-center text-lg">
                — {t.name}
              </h4>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots navigation */}
      <div className="flex justify-center mt-10 gap-2">
        {data.reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === activeIndex
                ? "bg-orange-500 scale-110"
                : "bg-white/50 hover:bg-orange-400"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
