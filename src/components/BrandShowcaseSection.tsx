// src/components/BrandShowcaseSection.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import SeoHelmet from "./SeoHelmet";

interface Brand {
  name: string;
  logo: string;
  desc_en: string;
  desc_hi: string;
}
interface BrandContent {
  brands: Brand[];
  footer_en?: string;
  footer_hi?: string;
}
interface BrandShowcaseProps {
  language: "en" | "hi";
}

const BrandShowcaseSection = ({ language }: BrandShowcaseProps) => {
  const [data, setData] = useState<BrandContent | null>(null);

  useEffect(() => {
    let active = true;

    const fetchBrands = async () => {
      try {
        // ✅ Lazy-load Firestore instance
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy-load Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const snap = await getDoc(doc(db, "content", "brands"));
        if (!active || !snap.exists()) return;

        const data = snap.data() as BrandContent;
        setData(data);

        // ✅ Optional cache for instant reuse
        sessionStorage.setItem("brands_data", JSON.stringify(data));
      } catch (e) {
        console.error("Error fetching brands:", e);
      }
    };

    // ✅ Try cache first
    const cached = sessionStorage.getItem("brands_data");
    if (cached) {
      setData(JSON.parse(cached));
    } else {
      fetchBrands();
    }

    return () => {
      active = false;
    };
  }, []);

  if (!data || !data.brands?.length) return null;

  return (
    <section className="relative overflow-x-hidden overflow-y-visible py-16 sm:py-20 px-4 sm:px-8 md:px-16 lg:px-20 bg-gradient-to-b from-white to-[#0B3B74]/5">
      <SeoHelmet
        pageKey="brands"
        language={language}
        title={
          language === "en"
            ? "We Service All Major Two-Wheeler Brands | Aashvi Automotive"
            : "हम सभी प्रमुख टू-व्हीलर ब्रांडों की सर्विस करते हैं | आश्वी ऑटोमोटिव"
        }
        description={
          language === "en"
            ? "Aashvi Automotive in Rajnagar, Madhubani offers expert two-wheeler repair and maintenance services for all major brands including Hero, Honda, TVS, Bajaj, Yamaha, and Suzuki."
            : "आश्वी ऑटोमोटिव, राजनगर (मधुबनी) में सभी प्रमुख टू-व्हीलर ब्रांडों जैसे हीरो, होंडा, टीवीएस, बजाज, यामाहा और सुजुकी की विशेषज्ञ सर्विस और मेंटेनेंस प्रदान करता है।"
        }
        schema={{
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          name: "Aashvi Automotive",
          image: "https://aashviautomotive.in/assets/logo.png",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rajnagar, Madhubani",
            addressLocality: "Madhubani",
            addressRegion: "Bihar",
            postalCode: "847235",
            addressCountry: "IN",
          },
          areaServed: ["Rajnagar", "Madhubani", "Bihar"],
          serviceType: "Two-wheeler repair and maintenance",
          makesOffer: {
            "@type": "OfferCatalog",
            name: "Two-Wheeler Brands Serviced",
            itemListElement: [
              { "@type": "Product", name: "Hero MotoCorp" },
              { "@type": "Product", name: "Honda Motorcycle & Scooter India" },
              { "@type": "Product", name: "TVS Motor" },
              { "@type": "Product", name: "Bajaj Auto" },
              { "@type": "Product", name: "Yamaha Motor" },
              { "@type": "Product", name: "Suzuki Motorcycle" },
            ],
          },
          sameAs: [
            "https://www.facebook.com/aashviautomotive",
            "https://maps.app.goo.gl/...your-map-link-here",
          ],
        }}
      />

      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B3B74] leading-snug">
          {language === "en"
            ? "We Service All Major Brands"
            : "हम सभी प्रमुख ब्रांडों की सर्विस करते हैं"}
        </h2>
      </div>

      {/* Brands Marquee */}
      <div className="max-w-6xl mx-auto">
        <BrandsMarquee brands={data.brands} language={language} />
      </div>

      {/* Footer tagline */}
      {(data.footer_en || data.footer_hi) && (
        <p className="text-center text-gray-700 mt-10 sm:mt-12 text-sm sm:text-base md:text-lg font-medium max-w-3xl mx-auto italic px-4">
          {language === "en" ? data.footer_en : data.footer_hi}
        </p>
      )}
    </section>
  );
};

function BrandsMarquee({
  brands,
  language,
}: {
  brands: Brand[];
  language: "en" | "hi";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = useState(0);

  // Measure single-row width
  useLayoutEffect(() => {
    const measure = () => {
      if (rowRef.current) setRowWidth(rowRef.current.scrollWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rowRef.current) ro.observe(rowRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Continuous motion value
  const x = useMotionValue(0);
  const speed = useRef(45); // px/sec; adjust as you like
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (!rowWidth || paused.current) return;
    // delta is ms; convert to seconds
    const moveBy = (speed.current * delta) / 1000;
    let next = x.get() - moveBy;

    // When we've shifted by one full row, wrap around for seamless loop
    if (-next >= rowWidth) {
      next += rowWidth;
    }
    x.set(next);
  });

  return (
    <div
      ref={trackRef}
      className="relative overflow-x-hidden overflow-y-visible group"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Edge fades for nicer look */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10" />

      {/* The moving track: two rows back-to-back */}
      <motion.div
        data-brand-track
        className="flex gap-12"
        style={{ x, willChange: "transform" }}
      >
        <div ref={rowRef} className="flex items-stretch gap-12">
          {brands.map((b, i) => (
            <BrandCard
              key={`row1-${b.name}-${i}`}
              brand={b}
              language={language}
            />
          ))}
        </div>
        <div className="flex items-stretch gap-12">
          {brands.map((b, i) => (
            <BrandCard
              key={`row2-${b.name}-${i}`}
              brand={b}
              language={language}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function BrandCard({
  brand,
  language,
}: {
  brand: Brand;
  language: "en" | "hi";
}) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileHover={{
        y: -10,
        scale: 1.05,
        zIndex: 20,
        boxShadow:
          "0 16px 30px rgba(11,59,116,0.18), 0 0 15px rgba(255,102,0,0.3)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="group relative z-0 bg-white rounded-2xl p-5 border border-gray-100 shadow-md flex flex-col items-center text-center h-[250px] md:h-[260px] hover:border-orange-400 transition-all duration-300 min-w-[220px]"
    >
      {/* Logo */}
      <div className="flex justify-center items-center h-16 w-full mb-3">
        <img
          src={brand.logo}
          alt={`${brand.name} logo`}
          className="h-12 md:h-14 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Brand Name */}
      <h3 className="text-lg font-semibold text-[#0B3B74] mb-2 leading-tight">
        {brand.name}
      </h3>

      {/* Description */}
      <p
        className="text-[13px] md:text-[14px] text-gray-600 leading-snug px-2 flex-1 overflow-hidden text-ellipsis"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {language === "en" ? brand.desc_en : brand.desc_hi}
      </p>

      {/* Underline */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-full bg-gradient-to-r from-orange-500 to-[#0B3B74] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

export default BrandShowcaseSection;
