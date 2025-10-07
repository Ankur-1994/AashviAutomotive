// src/components/AboutSection.tsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMotorcycle, FaTools, FaHome, FaStar } from "react-icons/fa";

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
    const fetchAbout = async () => {
      try {
        const docRef = doc(db, "content", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAbout(docSnap.data() as AboutData);
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
      }
    };
    fetchAbout();
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
    <section className="relative overflow-hidden py-24 px-6 md:px-20 bg-white">
      {/* 🔶 Balanced glowing backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(255,102,0,0.12),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,102,0,0.12),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(11,59,116,0.08),transparent_70%)]"></div>

      {/* Floating Parallax Icons */}
      <motion.div
        style={{ y: parallax1 }}
        className="absolute top-10 left-10 text-orange-200 text-5xl opacity-40 pointer-events-none"
      >
        <FaTools />
      </motion.div>
      <motion.div
        style={{ y: parallax2 }}
        className="absolute bottom-14 right-16 text-[#0B3B74]/30 text-6xl pointer-events-none"
      >
        <FaMotorcycle />
      </motion.div>
      <motion.div
        style={{ y: parallax1 }}
        className="absolute top-1/3 right-5 text-green-200 text-5xl opacity-30 pointer-events-none"
      >
        <FaHome />
      </motion.div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Workshop Image */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="absolute -inset-2 bg-gradient-to-tr from-orange-300 to-[#0B3B74] rounded-3xl blur-2xl opacity-30"></div>
          <img
            src={about.image}
            alt={language === "en" ? about.title_en : about.title_hi}
            className="relative z-10 rounded-3xl shadow-2xl w-full object-cover"
          />
        </motion.div>

        {/* Right: Text + Info */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#0B3B74] mb-3 leading-snug">
            {language === "en" ? about.title_en : about.title_hi}
          </h2>

          {/* Tagline */}
          <p className="text-orange-500 font-semibold text-lg mb-5">
            {language === "en" ? about.tagline_en : about.tagline_hi}
          </p>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {language === "en" ? about.desc_en : about.desc_hi}
          </p>

          {/* Points */}
          <motion.ul
            className="space-y-3 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {(language === "en" ? about.points_en : about.points_hi).map(
              (pt, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-center text-gray-800"
                >
                  <FaStar className="text-orange-500 mr-2 flex-shrink-0" />
                  <span>{pt}</span>
                </motion.li>
              )
            )}
          </motion.ul>

          {/* CTA Button */}
          <Link
            to={about.link}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-transform hover:scale-[1.05]"
          >
            <FaMotorcycle className="text-white w-5 h-5" />
            {language === "en" ? ctaEn : ctaHi}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
