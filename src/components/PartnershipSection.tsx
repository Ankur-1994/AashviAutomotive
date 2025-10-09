import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PartnershipData {
  heading_en: string;
  heading_hi: string;
  subheading_en: string;
  subheading_hi: string;
  desc_en: string;
  desc_hi: string;
  tagline_en: string;
  tagline_hi: string;
  cta_en: string;
  cta_hi: string;
  cta_link: string;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
  serviceforce_logo?: string;
  aashvi_logo?: string;
}

interface PartnershipSectionProps {
  language: "en" | "hi";
}

const PartnershipSection = ({ language }: PartnershipSectionProps) => {
  const [data, setData] = useState<PartnershipData | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        // ✅ Lazy-load Firestore instance
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy-load Firestore functions
        const { doc, getDoc } = await import("firebase/firestore");

        const snap = await getDoc(doc(db, "content", "partnership"));
        if (!active || !snap.exists()) return;

        const data = snap.data() as PartnershipData;
        setData(data);

        // ✅ Cache for instant subsequent loads
        sessionStorage.setItem("partnership_data", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching partnership data:", err);
      }
    };

    // ✅ Load from cache first for faster render
    const cached = sessionStorage.getItem("partnership_data");
    if (cached) {
      setData(JSON.parse(cached));
    } else {
      fetchData();
    }

    return () => {
      active = false;
    };
  }, []);

  if (!data) return null;

  const subheading =
    language === "en" ? data.subheading_en : data.subheading_hi;
  const desc = language === "en" ? data.desc_en : data.desc_hi;
  const tagline = language === "en" ? data.tagline_en : data.tagline_hi;
  const cta = language === "en" ? data.cta_en : data.cta_hi;

  const rawHeading = language === "en" ? data.heading_en : data.heading_hi;

  const BrandStyled = (
    <span className="font-extrabold whitespace-nowrap">
      <span className="text-green-600">Service</span>
      <span className="text-orange-500">Force</span>
    </span>
  );

  // Check for brand already present (both EN & HI)
  const hasEN = /service\s*force/i.test(rawHeading);
  const hasHI = /सर्विस\s*फोर्स/.test(rawHeading);

  let headingJSX: React.ReactNode;

  if (hasEN) {
    // Replace "Service Force" (any case/spacing) with styled brand
    const parts = rawHeading.split(/service\s*force/i);
    headingJSX = (
      <>
        {parts.map((p, i) => (
          <span key={`en-${i}`}>
            {p}
            {i < parts.length - 1 && BrandStyled}
          </span>
        ))}
      </>
    );
  } else if (hasHI) {
    // Replace "सर्विस फोर्स" with styled brand
    const parts = rawHeading.split(/सर्विस\s*फोर्स/);
    headingJSX = (
      <>
        {parts.map((p, i) => (
          <span key={`hi-${i}`}>
            {p}
            {i < parts.length - 1 && BrandStyled}
          </span>
        ))}
      </>
    );
  } else {
    // No brand present → append once
    headingJSX = (
      <>
        {rawHeading} {BrandStyled}
      </>
    );
  }

  return (
    <section
      className="relative py-24 px-6 md:px-20 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${data.gradient_from}, ${data.gradient_via}, ${data.gradient_to})`,
      }}
    >
      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        {/* LEFT: Partnership Visual */}
        <div className="relative flex flex-col items-center justify-center h-80 md:h-[420px]">
          {/* Animated soft background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-orange-100 opacity-80 rounded-3xl blur-2xl"
            animate={{
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Glass card with logos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex items-center justify-center bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-8 border border-white/40"
          >
            {/* Aashvi Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <img
                src={
                  data.aashvi_logo ||
                  "https://cdn.jsdelivr.net/gh/Ankur-1994/AashviAutomotive@main/src/assets/logo.jpeg"
                }
                alt="Aashvi Automotive"
                className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-full border-2 border-green-500 shadow-md bg-white p-1"
              />
              <span className="text-sm font-semibold text-gray-700 mt-2">
                Aashvi Automotive
              </span>
            </motion.div>

            {/* Animated connector */}
            <motion.div
              className="mx-4 md:mx-6 relative"
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-green-500 via-yellow-400 to-orange-500 rounded-full shadow-lg" />
              <motion.span
                className="absolute top-[-6px] left-0 w-3 h-3 rounded-full bg-green-500 shadow-md"
                animate={{ x: [0, 64, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Service Force Logo (slightly larger) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              <img
                src={
                  data.serviceforce_logo ||
                  "https://serviceforce.in/assets/img/logo.png"
                }
                alt="Service Force"
                className="h-20 w-20 md:h-24 md:w-24 object-contain rounded-full border-2 border-orange-500 shadow-md bg-white p-2"
              />
              <span className="text-sm font-semibold text-gray-700 mt-2">
                Service Force
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT: Text & CTA */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {headingJSX}
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-3">{subheading}</p>

          {/* Keep tagline only once on right side */}
          <p className="text-base md:text-lg text-gray-700 italic font-medium mb-3">
            {tagline}
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">{desc}</p>

          <motion.a
            href={data.cta_link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-transform"
          >
            {cta}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnershipSection;
