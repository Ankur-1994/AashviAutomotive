import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServicesSection from "../components/ServicesSection";
import PromoBanner from "../components/PromoBanner";
import AboutSection from "../components/AboutSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import BrandShowcaseSection from "../components/BrandShowcaseSection";
import SeoHelmet from "../components/SeoHelmet";
import PartnershipSection from "../components/PartnershipSection";
import { Link } from "react-router-dom";

interface Slide {
  image: string;
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
  cta_text: string;
  cta_link?: string;
  order: number;
  external?: boolean;
}

interface HomeProps {
  language: "en" | "hi";
}

const Home = ({ language }: HomeProps) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchSlides = async () => {
      try {
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "content", "home_hero");
        const docSnap = await getDoc(docRef);
        if (!active || !docSnap.exists()) return;
        const data = docSnap.data();
        if (Array.isArray(data.slides)) {
          const orderedSlides = [...data.slides].sort(
            (a: Slide, b: Slide) => a.order - b.order
          );
          setSlides(orderedSlides);
        }
      } catch (err) {
        console.error("Failed to fetch hero slides:", err);
      }
    };

    fetchSlides();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const t = setInterval(
        () => setCurrent((c) => (c + 1) % slides.length),
        5000
      );
      return () => clearInterval(t);
    }
  }, [slides.length]);

  if (slides.length === 0)
    return <div className="text-center py-20">Loading...</div>;

  const slide = slides[current];

  return (
    <div className="relative font-sans text-white">
      <SeoHelmet
        pageKey="home"
        language={language}
        title={language === "en" ? "Home" : "मुखपृष्ठ"}
        schema={{
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          name: "Aashvi Automotive",
          image:
            "https://cdn.jsdelivr.net/gh/Ankur-1994/AashviAutomotive@main/src/assets/logo.jpeg",
          telephone: "+919229768624",
          email: "aashviautomotive2025@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Ground Floor, Rishikesh Complex, Simri Dih Chowk, Near Hatiyagachi",
            addressLocality: "Rajnagar",
            addressRegion: "Madhubani",
            postalCode: "847235",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 26.3841554,
            longitude: 86.1427815,
          },
          openingHours: ["Mon-Sun 09:00-18:00"],
          url: "https://aashviautomotive.in/",
        }}
      />

      {/* ✅ HERO SECTION — Visually Centered and Navbar-Safe */}
      <div className="relative w-full overflow-hidden text-white font-sans">
        {/* 🔹 Background image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slide.image}
              alt={language === "en" ? slide.title_en : slide.title_hi}
              width="1920"
              height="1080"
              fetchPriority={current === 0 ? "high" : "auto"}
              loading={current === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* 🔹 Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>

        {/* 🔹 Text + CTA Container */}
        <motion.div
          key={language + current}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 flex flex-col justify-center items-center text-center px-6 sm:px-8 md:px-12"
          style={{
            minHeight: "calc(100vh - var(--navbar-height, 80px))",
            paddingTop: "var(--navbar-height, 80px)",
          }}
        >
          <div className="flex flex-col items-center justify-center max-w-5xl mx-auto py-8 sm:py-10 md:py-12 lg:py-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg text-orange-400">
              {language === "en" ? slide.title_en : slide.title_hi}
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl md:max-w-3xl mb-6 sm:mb-8 text-gray-100 drop-shadow leading-relaxed px-2">
              {language === "en" ? slide.desc_en : slide.desc_hi}
            </p>

            {slide.cta_link && (
              <div className="flex justify-center flex-wrap gap-3 sm:gap-4">
                {slide.external ? (
                  <a
                    href={slide.cta_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    {language === "en"
                      ? slide.cta_text.split("/")[0].trim()
                      : slide.cta_text.split("/")[1].trim()}
                  </a>
                ) : (
                  <Link
                    to={slide.cta_link}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    {language === "en"
                      ? slide.cta_text.split("/")[0].trim()
                      : slide.cta_text.split("/")[1].trim()}
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* 🔹 Dots */}
        <div className="absolute bottom-6 w-full flex justify-center space-x-2 z-30">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full transition-all cursor-pointer ${
                index === current
                  ? "bg-orange-500 scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>

      {/* ✅ SECTIONS */}
      <PartnershipSection language={language} />
      <ServicesSection language={language} />
      <BrandShowcaseSection language={language} />
      <PromoBanner language={language} />
      <AboutSection language={language} />
      <TestimonialsSection language={language} />
      <ContactSection language={language} />
    </div>
  );
};

export default Home;
