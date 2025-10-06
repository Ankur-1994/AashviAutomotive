import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface AboutData {
  image: string;
  title_en: string;
  title_hi: string;
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

  if (!about) return null;

  const [ctaEn, ctaHi] = about.cta_text
    ? about.cta_text.split("/").map((s) => s.trim())
    : [about.cta_text, about.cta_text];

  return (
    <section className="py-20 px-6 md:px-20 bg-white text-gray-900">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img
            src={about.image}
            alt="Aashvi Automotive Workshop"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </motion.div>

        {/* Right: Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B3B74] mb-4">
            {language === "en" ? about.title_en : about.title_hi}
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {language === "en" ? about.desc_en : about.desc_hi}
          </p>

          <ul className="space-y-2 mb-6 list-disc list-inside text-gray-700">
            {(language === "en" ? about.points_en : about.points_hi).map(
              (point, i) => (
                <li key={i}>{point}</li>
              )
            )}
          </ul>

          <Link
            to={about.link}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-transform hover:scale-[1.03]"
          >
            {language === "en" ? ctaEn : ctaHi}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
