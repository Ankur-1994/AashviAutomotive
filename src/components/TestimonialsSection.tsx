import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import SeoHelmet from "../components/SeoHelmet";

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

  // ✅ Fetch Testimonials from Firebase (with caching)
  useEffect(() => {
    let active = true;

    const fetchTestimonials = async () => {
      try {
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();
        const { doc, getDoc } = await import("firebase/firestore");

        const snap = await getDoc(doc(db, "content", "testimonials"));
        if (!active || !snap.exists()) return;

        const fetchedData = snap.data() as TestimonialsContent;
        setData(fetchedData);
        sessionStorage.setItem(
          "testimonials_data",
          JSON.stringify(fetchedData)
        );
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };

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

  // ✅ Auto slide animation
  useEffect(() => {
    if (!data?.reviews?.length) return;
    const id = setInterval(
      () => setActiveIndex((prev) => (prev + 1) % data.reviews.length),
      7000
    );
    return () => clearInterval(id);
  }, [data?.reviews?.length]);

  if (!data || !data.reviews?.length) return null;
  const t = data.reviews[activeIndex];

  // ✅ Prepare Structured Data Schema
  const averageRating =
    data.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
    data.reviews.length;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Aashvi Automotive",
    image: "https://aashviautomotive.in/favicon.ico",
    telephone: "+919229768624",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rishikesh Complex, Simri Dih Chowk, Rajnagar, Madhubani",
      addressRegion: "Bihar",
      postalCode: "847235",
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: data.reviews.length,
    },
    review: data.reviews.map((r) => ({
      "@type": "Review",
      author: r.name,
      reviewBody: language === "en" ? r.review_en : r.review_hi,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
      },
    })),
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-10 md:px-16 lg:px-20 bg-gradient-to-br from-[#0B3B74]/90 via-[#0B3B74]/70 to-white overflow-hidden text-white">
      {/* ✅ SEO Meta */}
      <SeoHelmet
        pageKey="testimonials"
        language={language}
        title={
          language === "en" ? "Customer Testimonials" : "ग्राहक प्रशंसापत्र"
        }
        description={
          language === "en"
            ? "See what our customers say about Aashvi Automotive — trusted multibrand two-wheeler workshop in Rajnagar, Madhubani."
            : "देखें हमारे ग्राहकों का क्या कहना है — आश्वी ऑटोमोटिव, राजनगर (मधुबनी) की विश्वसनीय बाइक सर्विस।"
        }
        schema={schema}
      />

      {/* Decorative glows */}
      <div className="pointer-events-none absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_bottom_right,rgba(255,102,0,0.12),transparent_70%)]" />

      {/* ✅ Main Wrapper */}
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col xl:flex-row items-center gap-10 sm:gap-12">
        {/* LEFT */}
        <div className="flex-1 text-center xl:text-left px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-snug text-white">
            {language === "en" ? data.title_en : data.title_hi}
          </h2>
          <p className="text-blue-100 max-w-md mx-auto xl:mx-0 text-sm sm:text-base md:text-lg leading-relaxed">
            {language === "en" ? data.subtitle_en : data.subtitle_hi}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex-1 relative w-full max-w-md sm:max-w-lg mx-auto xl:mx-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6 }}
              className="relative bg-white text-gray-900 rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-8 md:p-10 w-full mx-auto overflow-hidden"
            >
              {/* Review */}
              <p className="text-gray-700 italic text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 text-center">
                “{language === "en" ? t.review_en : t.review_hi}”
              </p>

              <div className="flex justify-center mb-3 text-orange-500">
                {Array.from({ length: 5 }).map((_, i) =>
                  i < t.rating ? <FaStar key={i} /> : null
                )}
              </div>

              <h4 className="text-[#0B3B74] font-semibold text-center text-base sm:text-lg">
                — {t.name}
              </h4>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ✅ Dots Navigation */}
      <div className="flex justify-center mt-8 sm:mt-10 gap-2 sm:gap-3">
        {data.reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-transform duration-300 ${
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
