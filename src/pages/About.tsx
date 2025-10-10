import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SeoHelmet from "../components/SeoHelmet";

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
    let active = true;

    const fetchAbout = async () => {
      try {
        // ✅ Lazy-load Firestore only when needed
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy import Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const docSnap = await getDoc(doc(db, "content", "about"));
        if (!active || !docSnap.exists()) return;

        const data = docSnap.data() as AboutContent;
        setAbout(data);

        // ✅ Cache data for instant subsequent loads
        sessionStorage.setItem("about_data", JSON.stringify(data));
      } catch (error) {
        console.error("Error loading about content:", error);
      }
    };

    // ✅ Try cached data first for faster paint
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

  if (!about)
    return (
      <div className="text-center py-40 text-gray-500 text-lg">
        Loading content...
      </div>
    );

  const isEn = language === "en";

  return (
    <div className="font-sans overflow-hidden relative">
      <SeoHelmet
        pageKey="about"
        language={language}
        title={language === "en" ? "About Us" : "हमारे बारे में"}
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Aashvi Automotive",
          parentOrganization: {
            "@type": "Organization",
            name: "Service Force",
          },
          url: "https://aashviautomotive.in/about",
          logo: "https://cdn.jsdelivr.net/gh/Ankur-1994/AashviAutomotive@main/src/assets/logo.jpeg",
        }}
      />

      {/* 🔹 Hero Section */}
      <section className="relative flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#0B3B74] via-[#0B3B74]/95 to-[#102f5c] text-white px-6 sm:px-10 md:px-20 py-24 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 max-w-4xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md">
            {isEn ? about.title_about_en : about.title_about_hi}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 font-light leading-relaxed">
            {isEn ? about.desc_en : about.desc_hi}
          </p>
        </motion.div>

        {/* Decorative glows */}
        <div className="absolute bottom-0 left-10 w-40 h-40 sm:w-60 sm:h-60 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-10 w-52 h-52 sm:w-72 sm:h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      </section>

      {/* 🔹 About Details */}
      <section className="relative bg-gradient-to-b from-white via-[#FDF5EF] to-white py-16 sm:py-20 px-6 sm:px-10 md:px-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <img
              src={about.image}
              alt="Aashvi Automotive Workshop"
              className="rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg object-cover border border-orange-100"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-orange-500 to-[#0B3B74] w-20 h-20 sm:w-24 sm:h-24 rounded-2xl blur-xl opacity-30"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B3B74] mb-4">
              {isEn ? "Who We Are" : "हम कौन हैं"}
            </h2>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {isEn ? about.desc_en : about.desc_hi}
            </p>

            {about.points_en && (
              <ul className="space-y-3 mb-6 text-gray-700 text-left inline-block sm:block">
                {(isEn ? about.points_en : about.points_hi)?.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 text-lg mt-1">✔</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

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

      {/* 🔹 Mission & Vision */}
      {(about.mission_en || about.vision_en) && (
        <section className="bg-gradient-to-r from-[#0B3B74]/5 to-orange-50 py-14 sm:py-16 px-6 sm:px-10 md:px-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 sm:p-8 bg-white rounded-2xl shadow-lg border-t-4 border-orange-500"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B3B74] mb-3">
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
              className="p-6 sm:p-8 bg-white rounded-2xl shadow-lg border-t-4 border-[#0B3B74]"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B3B74] mb-3">
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
