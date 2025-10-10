// src/components/AboutSection.tsx
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMotorcycle, FaTools, FaHome, FaStar } from "react-icons/fa";
import SeoHelmet from "./SeoHelmet";

interface AboutData {
  image: string;
  title_en: string;
  title_hi: string;
  tagline_en: string;
  tagline_hi: string;
  desc_en: string;
  desc_hi: string;
  points_en: string[];
  points_hi: string[];
  cta_text: string;
  link: string;
}

interface AboutSectionProps {
  language: "en" | "hi";
}

const AboutSection = ({ language }: AboutSectionProps) => {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    let active = true;

    const fetchAbout = async () => {
      try {
        // ✅ Lazy-load Firebase Firestore
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy-load Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const docRef = doc(db, "content", "about");
        const docSnap = await getDoc(docRef);

        if (!active || !docSnap.exists()) return;

        const data = docSnap.data() as AboutData;
        setAbout(data);

        // ✅ Optional: cache for faster revisit
        sessionStorage.setItem("about_data", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching about data:", err);
      }
    };

    // ✅ Check cache first to avoid refetch
    const cached = sessionStorage.getItem("about_data");
    if (cached) {
      setAbout(JSON.parse(cached));
    } else {
      fetchAbout();
    }

    return () => {
      active = false;
    };
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -20]);
  const y2 = useTransform(scrollY, [0, 300], [0, 20]);
  const parallax1 = useSpring(y1, { stiffness: 50, damping: 20 });
  const parallax2 = useSpring(y2, { stiffness: 50, damping: 20 });

  if (!about) return null;

  const [ctaEn, ctaHi] = about.cta_text
    ? about.cta_text.split("/").map((s) => s.trim())
    : [about.cta_text, about.cta_text];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 lg:px-20 bg-white">
      <SeoHelmet
        pageKey="about"
        language={language}
        title={language === "en" ? "About Us" : "हमारे बारे में"}
        schema={{
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          name: "Aashvi Automotive",
          parentOrganization: "Service Force",
        }}
      />

      {/* Glowing backgrounds (unchanged) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(255,102,0,0.12),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,102,0,0.12),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(11,59,116,0.08),transparent_70%)]"></div>

      {/* Floating icons (unchanged, size tweaked for small screens) */}
      <motion.div
        style={{ y: parallax1 }}
        className="absolute top-8 left-6 text-orange-200 text-4xl sm:text-5xl opacity-40 pointer-events-none"
      >
        <FaTools />
      </motion.div>
      <motion.div
        style={{ y: parallax2 }}
        className="absolute bottom-10 right-6 text-[#0B3B74]/30 text-5xl sm:text-6xl pointer-events-none"
      >
        <FaMotorcycle />
      </motion.div>
      <motion.div
        style={{ y: parallax1 }}
        className="absolute top-1/3 right-2 text-green-200 text-4xl sm:text-5xl opacity-30 pointer-events-none"
      >
        <FaHome />
      </motion.div>

      {/* ✅ Responsive container: single column until xl */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-14 items-center relative z-10">
        {/* Image FIRST in DOM so it stays above text on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-2xl mx-auto"
        >
          <div className="absolute -inset-2 bg-gradient-to-tr from-orange-300 to-[#0B3B74] rounded-3xl blur-2xl opacity-30"></div>
          <img
            src={about.image}
            alt={language === "en" ? about.title_en : about.title_hi}
            className="relative z-10 rounded-3xl shadow-2xl w-full h-auto object-cover"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center xl:text-left max-w-2xl mx-auto xl:mx-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0B3B74] mb-3 leading-snug">
            {language === "en" ? about.title_en : about.title_hi}
          </h2>

          <p className="text-orange-500 font-semibold text-base sm:text-lg mb-4">
            {language === "en" ? about.tagline_en : about.tagline_hi}
          </p>

          <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-6 leading-relaxed">
            {language === "en" ? about.desc_en : about.desc_hi}
          </p>

          <motion.ul
            className="space-y-3 mb-8 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {(language === "en" ? about.points_en : about.points_hi).map(
              (pt, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-start text-gray-800 text-sm sm:text-base"
                >
                  <FaStar className="text-orange-500 mr-2 mt-[3px] flex-shrink-0" />
                  <span>{pt}</span>
                </motion.li>
              )
            )}
          </motion.ul>

          <div className="flex justify-center xl:justify-start">
            <Link
              to={about.link}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg transition-transform hover:scale-[1.05]"
            >
              <FaMotorcycle className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              {language === "en" ? ctaEn : ctaHi}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
