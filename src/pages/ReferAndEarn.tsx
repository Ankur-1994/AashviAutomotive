import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SeoHelmet from "../components/SeoHelmet";

interface ReferData {
  heading_en: string;
  heading_hi: string;
  desc_en: string;
  desc_hi: string;
  how_it_works_en: string[];
  how_it_works_hi: string[];
  cta_en: string;
  cta_hi: string;
  cta_link: string;
  banner_url: string;
  rewards_en: string;
  rewards_hi: string;
}

interface ReferProps {
  language: "en" | "hi";
}

const ReferAndEarn = ({ language }: ReferProps) => {
  const [data, setData] = useState<ReferData | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        // ✅ Lazy-load Firestore only when needed
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy import Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const snap = await getDoc(doc(db, "content", "refer_and_earn"));
        if (!active || !snap.exists()) return;

        const data = snap.data() as ReferData;
        setData(data);

        // ✅ Cache the data for instant reloads
        sessionStorage.setItem("refer_and_earn_data", JSON.stringify(data));
      } catch (err) {
        console.error("Error loading Refer & Earn:", err);
      }
    };

    // ✅ Try cache first for faster load
    const cached = sessionStorage.getItem("refer_and_earn_data");
    if (cached) {
      setData(JSON.parse(cached));
    } else {
      fetchData();
    }

    return () => {
      active = false;
    };
  }, []);

  if (!data)
    return <div className="text-center py-20 font-medium">Loading...</div>;

  const heading = language === "en" ? data.heading_en : data.heading_hi;
  const desc = language === "en" ? data.desc_en : data.desc_hi;
  const steps = language === "en" ? data.how_it_works_en : data.how_it_works_hi;
  const cta = language === "en" ? data.cta_en : data.cta_hi;
  const rewards = language === "en" ? data.rewards_en : data.rewards_hi;

  return (
    <>
      <SeoHelmet
        pageKey="refer"
        language={language}
        title={heading}
        schema={{
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          name: "Aashvi Automotive",
          description:
            "Refer your friends to Aashvi Automotive and earn discounts on your next bike service.",
        }}
      />

      <section className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 px-4 sm:px-6 md:px-10 lg:px-20 pt-28 md:pt-24 pb-16">
        <div className="max-w-7xl w-full grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-10 sm:gap-12 md:gap-14 lg:gap-16 items-center">
          {/* Left: Banner Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center"
          >
            <div className="w-full flex justify-center">
              <img
                src={data.banner_url}
                alt="Refer and Earn"
                className="rounded-2xl shadow-xl w-[85%] sm:w-[70%] md:w-[60%] xl:w-full max-w-[480px] h-auto object-contain"
              />
            </div>
          </motion.div>

          {/* Right: Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center xl:text-left md:px-4 lg:px-0"
          >
            <h1 className="text-3xl sm:text-4xl md:text-[2.3rem] xl:text-5xl font-extrabold text-gray-900 mb-4 leading-snug">
              {heading}
            </h1>
            <p className="text-base sm:text-lg md:text-[1.05rem] text-gray-700 mb-6 leading-relaxed max-w-xl mx-auto xl:mx-0">
              {desc}
            </p>

            <div className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 border-l-4 border-orange-500 mb-6 text-left mx-auto xl:mx-0 max-w-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">
                {language === "en" ? "How It Works" : "यह कैसे काम करता है"}
              </h2>
              <ul className="space-y-3 text-gray-700">
                {steps.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start gap-2 text-sm sm:text-base"
                  >
                    <span className="text-orange-500 font-bold">
                      {index + 1}.
                    </span>
                    {step}
                  </motion.li>
                ))}
              </ul>
            </div>

            <p className="text-green-700 font-semibold mb-6 text-sm sm:text-base">
              {rewards}
            </p>

            <motion.a
              href={data.cta_link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg shadow-md transition-transform text-sm sm:text-base"
            >
              {cta}
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ReferAndEarn;
