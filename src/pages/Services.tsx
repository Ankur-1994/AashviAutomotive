import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import SeoHelmet from "../components/SeoHelmet";
import { Link } from "react-router-dom";
import {
  Bike,
  Wrench,
  BatteryCharging,
  Droplet,
  Filter,
  Laptop2,
  Cog,
  Package,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface ServiceItem {
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
  icon: string;
  badge_en?: string;
  badge_hi?: string;
}

interface ServicesContent {
  heading_en: string;
  heading_hi: string;
  subheading_en: string;
  subheading_hi: string;
  services: ServiceItem[];
}

interface ServicesProps {
  language: "en" | "hi";
}

const Services = ({ language }: ServicesProps) => {
  const [data, setData] = useState<ServicesContent | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const isCtaInView = useInView(ctaRef, {
    amount: 0.2,
    margin: "0px 0px -200px 0px",
  });

  const IconFor = (key: string) => {
    const base = "w-10 h-10 transition-colors duration-300";
    switch (key) {
      case "wrench":
        return <Wrench className={base} />;
      case "engine":
        return <Cog className={base} />;
      case "battery":
        return <BatteryCharging className={base} />;
      case "alert":
        return <AlertTriangle className={base} />;
      case "oil":
        return (
          <div className="relative inline-flex items-center justify-center">
            <Droplet className={`${base}`} />
            <Filter className="w-4 h-4 absolute -right-2 -bottom-1 opacity-80" />
          </div>
        );
      case "wash":
        return (
          <div className="relative inline-flex items-center justify-center">
            <Sparkles className={base} />
            <Droplet className="w-4 h-4 absolute -right-2 -bottom-1 opacity-80" />
          </div>
        );
      case "bike":
        return <Bike className={base} />;
      case "diagnostics":
        return <Laptop2 className={base} />;
      case "parts":
        return <Package className={base} />;
      default:
        return <Wrench className={base} />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, "content", "service_page"));
      if (docSnap.exists()) setData(docSnap.data() as ServicesContent);
    };
    fetchData();
  }, []);

  if (!data)
    return <div className="text-center py-20 text-gray-700">Loading...</div>;

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden">
      <SeoHelmet
        pageKey="services"
        language={language}
        title={language === "en" ? "Our Services" : "हमारी सेवाएं"}
        description={
          language === "en"
            ? "Explore Aashvi Automotive’s expert two-wheeler services — trusted by hundreds of customers in Rajnagar and Madhubani."
            : "आश्वी ऑटोमोटिव की एक्सपर्ट टू-व्हीलर सेवाएं देखें — राजनगर और मधुबनी के सैकड़ों ग्राहकों का भरोसा।"
        }
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Aashvi Automotive Services",
          provider: { "@type": "Organization", name: "Service Force" },
        }}
      />

      {/* 🔶 Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-black to-orange-900 opacity-90"></div>

      {/* 🌟 Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center px-6 md:px-20 pt-28 pb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-orange-400 mb-3 drop-shadow-lg">
          {language === "en" ? data.heading_en : data.heading_hi}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
          {language === "en" ? data.subheading_en : data.subheading_hi}
        </p>
      </motion.div>

      {/* ⚙️ Services Cards */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-20 z-10">
        {data.services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group bg-gradient-to-br from-gray-900/80 to-gray-800/70 border border-gray-700 rounded-3xl shadow-2xl p-8 text-center hover:shadow-orange-500/30 hover:-translate-y-2 transition-all duration-500 backdrop-blur-md"
          >
            <div className="flex justify-center mb-5 transform transition-transform duration-300 group-hover:scale-110">
              {IconFor(service.icon)}
            </div>
            <h3 className="text-2xl font-semibold text-orange-400 mb-3">
              {language === "en" ? service.title_en : service.title_hi}
            </h3>
            {(service.badge_en || service.badge_hi) && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-3 ${
                  service.icon === "alert"
                    ? "bg-orange-500/20 text-orange-300"
                    : "bg-blue-500/20 text-blue-300"
                }`}
              >
                {language === "en" ? service.badge_en : service.badge_hi}
              </motion.span>
            )}
            <p className="text-gray-300 leading-relaxed">
              {language === "en" ? service.desc_en : service.desc_hi}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 🧡 Book Now CTA (kept same as before) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        ref={ctaRef}
        className="relative mt-24 mx-auto max-w-4xl text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-xl py-12 px-6 md:px-12 text-white z-10"
      >
        <h2 className="text-3xl font-bold mb-4">
          {language === "en"
            ? "Ready to Book Your Service?"
            : "क्या आप अपनी सर्विस बुक करने के लिए तैयार हैं?"}
        </h2>
        <p className="text-lg mb-8 text-orange-100">
          {language === "en"
            ? "Experience professional-grade two-wheeler care with Aashvi Automotive and Service Force."
            : "आश्वी ऑटोमोटिव और सर्विस फोर्स के साथ प्रोफेशनल-ग्रेड टू-व्हीलर केयर का अनुभव करें।"}
        </p>
        <Link
          to="/booking"
          className="inline-block bg-white text-orange-600 hover:bg-orange-100 font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
        >
          {language === "en" ? "Book Service Now" : "अभी बुक करें"}
        </Link>
      </motion.div>

      {/* subtle gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-transparent"></div>

      {/* 🧡 Floating CTA Button with perfect circular glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: isCtaInView ? 0 : 1,
          scale: isCtaInView ? 0.8 : 1,
          y: isCtaInView ? 20 : 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed bottom-6 left-6 z-50"
      >
        <motion.div
          className="relative rounded-full p-[2px] bg-transparent"
          animate={{
            boxShadow: [
              "0 0 0px rgba(255, 153, 0, 0)",
              "0 0 18px rgba(255, 153, 0, 0.8)",
              "0 0 0px rgba(255, 153, 0, 0)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          <Link
            to="/booking"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-5 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
            style={{
              filter: "drop-shadow(0 0 6px rgba(255,140,0,0.4))",
            }}
          >
            {language === "en" ? "Book Now" : "अभी बुक करें"}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Services;
