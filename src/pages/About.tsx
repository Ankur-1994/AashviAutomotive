import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface AboutContent {
  title_about_en: string;
  title_about_hi: string;
  desc_en: string;
  desc_hi: string;
  image: string;
  mission_en?: string;
  mission_hi?: string;
  vision_en?: string;
  vision_hi?: string;
  points_en?: string[];
  points_hi?: string[];
  cta_text_about?: string;
  link_about?: string;
}

interface AboutProps {
  language: "en" | "hi";
}

const About = ({ language }: AboutProps) => {
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docSnap = await getDoc(doc(db, "content", "about"));
        if (docSnap.exists()) setAbout(docSnap.data() as AboutContent);
      } catch (error) {
        console.error("Error loading about content:", error);
      }
    };
    fetchAbout();
  }, []);

  if (!about)
    return (
      <div className="text-center py-40 text-gray-500 text-lg">
        Loading content...
      </div>
    );

  const isEn = language === "en";

  return (
    <div className="font-sans overflow-hidden relative">
      <Helmet>
        <title>
          {isEn
            ? `About Us | Aashvi Automotive`
            : `हमारे बारे में | आश्वी ऑटोमोटिव`}
        </title>
        <meta
          name="description"
          content={
            isEn
              ? about.desc_en ||
                "Learn more about Aashvi Automotive, your trusted multibrand 2-wheeler service center in Rajnagar, Madhubani."
              : about.desc_hi ||
                "आश्वी ऑटोमोटिव के बारे में जानें, राजनगर, मधुबनी का भरोसेमंद मल्टीब्रांड टू-व्हीलर सर्विस सेंटर।"
          }
        />
      </Helmet>

      {/* 🔹 Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#0B3B74] via-[#0B3B74]/95 to-[#102f5c] text-white px-6 md:px-20 py-24 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md">
            {isEn ? about.title_about_en : about.title_about_hi}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-light leading-relaxed">
            {isEn ? about.desc_en : about.desc_hi}
          </p>
        </motion.div>

        {/* Orange Glow Accents */}
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      </section>

      {/* 🔹 About Details Section */}
      <section className="relative bg-gradient-to-b from-white via-[#FDF5EF] to-white py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img
              src={about.image}
              alt="Aashvi Automotive Workshop"
              className="rounded-2xl shadow-2xl w-full object-cover border border-orange-100"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-orange-500 to-[#0B3B74] w-24 h-24 rounded-2xl blur-xl opacity-30"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B3B74] mb-4">
              {isEn ? "Who We Are" : "हम कौन हैं"}
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {isEn ? about.desc_en : about.desc_hi}
            </p>

            {/* Points */}
            {about.points_en && (
              <ul className="space-y-3 mb-6 text-gray-700">
                {(isEn ? about.points_en : about.points_hi)?.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 text-lg">✔</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            {about.cta_text_about && (
              <Link
                to={about.link_about || "/booking"}
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-transform hover:scale-[1.03]"
              >
                {isEn
                  ? about.cta_text_about.split("/")[0].trim()
                  : about.cta_text_about.split("/")[1]?.trim() ||
                    "अभी बुक करें"}
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* 🔹 Mission & Vision Section */}
      {(about.mission_en || about.vision_en) && (
        <section className="bg-gradient-to-r from-[#0B3B74]/5 to-orange-50 py-16 px-6 md:px-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 bg-white rounded-2xl shadow-lg border-t-4 border-orange-500"
            >
              <h3 className="text-2xl font-bold text-[#0B3B74] mb-3">
                {isEn ? "Our Mission" : "हमारा मिशन"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {isEn ? about.mission_en : about.mission_hi}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-white rounded-2xl shadow-lg border-t-4 border-[#0B3B74]"
            >
              <h3 className="text-2xl font-bold text-[#0B3B74] mb-3">
                {isEn ? "Our Vision" : "हमारा विजन"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {isEn ? about.vision_en : about.vision_hi}
              </p>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
