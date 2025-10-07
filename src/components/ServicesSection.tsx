import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ServiceItem {
  icon: string;
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
  tags?: string[];
  details_en?: string[];
  details_hi?: string[];
}

interface ServicesDoc {
  title_en?: string;
  title_hi?: string;
  subtitle_en?: string;
  subtitle_hi?: string;
  global_cta_en?: string;
  global_cta_hi?: string;
  global_cta_link?: string;
  items: ServiceItem[];
}

interface ServicesSectionProps {
  language: "en" | "hi";
}

const ServicesSection = ({ language }: ServicesSectionProps) => {
  const [data, setData] = useState<ServicesDoc | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const ref = doc(db, "content", "services");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const docData = snap.data() as ServicesDoc;
          setData({
            ...docData,
            items: Array.isArray(docData.items) ? docData.items : [],
          });
        }
      } catch (e) {
        console.error("Error fetching services:", e);
      }
    };
    fetchServices();
  }, []);

  if (!data) return null;

  const heading = language === "en" ? data.title_en : data.title_hi;
  const subheading = language === "en" ? data.subtitle_en : data.subtitle_hi;
  const globalCTA = language === "en" ? data.global_cta_en : data.global_cta_hi;

  return (
    <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#0B3B74]/5 to-white text-gray-900">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#0B3B74] mb-4">{heading}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          {subheading}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 max-w-6xl mx-auto">
        {data.items.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 relative"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <img
                src={service.icon}
                alt={language === "en" ? service.title_en : service.title_hi}
                className="w-16 h-16 object-contain transition-transform duration-500 group-hover:scale-110
                           brightness-0 invert-[0.5] sepia-[1] saturate-[10000%] hue-rotate-[5deg]"
                loading="lazy"
              />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2 text-center text-[#0B3B74] group-hover:text-orange-500 transition-colors">
              {language === "en" ? service.title_en : service.title_hi}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed text-center mb-5">
              {language === "en" ? service.desc_en : service.desc_hi}
            </p>

            {/* Tags */}
            {service.tags && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {service.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-orange-50 text-orange-600 font-medium border border-orange-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Expand Button */}
            {/* Expand Button */}
            {service.details_en && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  className="flex items-center justify-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-all"
                >
                  {expandedIndex === index
                    ? language === "en"
                      ? "Hide Details"
                      : "विवरण छिपाएँ"
                    : language === "en"
                    ? "Know More"
                    : "विवरण देखें"}
                  {expandedIndex === index ? (
                    <FaChevronUp className="w-4 h-4" />
                  ) : (
                    <FaChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            {/* Animated Expandable Section */}
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <ul className="text-left text-gray-600 mt-4 space-y-1 text-sm border-t border-gray-200 pt-4">
                    {(language === "en"
                      ? service.details_en
                      : service.details_hi
                    )?.map((point, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-orange-500 mt-[2px]">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Global CTA */}
      <div className="text-center mt-16">
        <a
          href={data.global_cta_link || "/booking"}
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-10 py-4 rounded-xl shadow-lg transition-all"
        >
          {globalCTA ||
            (language === "en" ? "Book a Service Now" : "अभी सर्विस बुक करें")}
        </a>
      </div>
    </section>
  );
};

export default ServicesSection;
