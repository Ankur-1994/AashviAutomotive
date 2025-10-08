import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
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

  // Fetch hero slides from Firestore
  useEffect(() => {
    const fetchSlides = async () => {
      const docRef = doc(db, "content", "home_hero");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.slides)) {
          // ✅ Sort client-side by order field
          const orderedSlides = [...data.slides].sort(
            (a: Slide, b: Slide) => a.order - b.order
          );
          setSlides(orderedSlides);
        }
      }
    };
    fetchSlides();
  }, []);

  // Carousel auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(timer);
  }, [slides]);

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
          url: "https://aashviautomotive.web.app/",
        }}
      />

      {/* Hero Section */}
      <div className="relative h-[100vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

        {/* Text content */}
        <motion.div
          key={language + current}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col justify-center items-center text-center px-6 md:px-20 h-full"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg text-orange-400">
            {language === "en" ? slide.title_en : slide.title_hi}
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mb-8 text-gray-100 drop-shadow">
            {language === "en" ? slide.desc_en : slide.desc_hi}
          </p>

          {slide.cta_link &&
            (slide.external ? (
              <a
                href={slide.cta_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {language === "en"
                  ? slide.cta_text.split("/")[0].trim()
                  : slide.cta_text.split("/")[1].trim()}
              </a>
            ) : (
              <Link
                to={slide.cta_link}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {language === "en"
                  ? slide.cta_text.split("/")[0].trim()
                  : slide.cta_text.split("/")[1].trim()}
              </Link>
            ))}
        </motion.div>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 w-full flex justify-center space-x-2 z-20">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current
                  ? "bg-orange-500 scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setCurrent(index)}
            ></div>
          ))}
        </div>
      </div>

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
