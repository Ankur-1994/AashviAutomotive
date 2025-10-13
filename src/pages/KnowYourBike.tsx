// src/pages/KnowYourBike.tsx
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SeoHelmet from "../components/SeoHelmet";

type Language = "en" | "hi";
const BikeStage = lazy(() => import("../sections/kyb/BikeStage"));

interface KnowYourBikeData {
  metadata: {
    en: {
      title: string;
      subtitle: string;
      description: string;
      tip: string;
    };
    hi: {
      title: string;
      subtitle: string;
      description: string;
      tip: string;
    };
    seo: Record<string, any>;
  };
  model: {
    modelUrl: string;
    scale: number;
    rotationSpeed: number;
    cameraOffsetY: number;
    lighting: {
      ambientIntensity: number;
      directionalIntensity: number;
      hemisphereIntensity: number;
    };
    environment: string;
    backgroundColor: string;
  };
  hotspots: any[];
}

export default function KnowYourBike({ language = "en" as Language }) {
  const [data, setData] = useState<KnowYourBikeData | null>(null);
  const isEn = language === "en";

  useEffect(() => {
    let active = true;

    const fetchContent = async () => {
      try {
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();
        const { doc, getDoc } = await import("firebase/firestore");

        const docRef = doc(db, "content", "knowYourBike");
        const docSnap = await getDoc(docRef);
        if (!active || !docSnap.exists()) return;

        const docData = docSnap.data() as KnowYourBikeData;
        setData(docData);
        sessionStorage.setItem("knowYourBike_data", JSON.stringify(docData));
      } catch (err) {
        console.error("Failed to fetch KnowYourBike content:", err);
      }
    };

    const cached = sessionStorage.getItem("knowYourBike_data");
    if (cached) setData(JSON.parse(cached));
    else fetchContent();

    return () => {
      active = false;
    };
  }, [language]);

  // Fallbacks if Firebase not loaded
  const metadata = data?.metadata?.[language] || {
    title: isEn ? "Know Your Bike" : "अपनी बाइक को जानें",
    subtitle: isEn
      ? "Drag to rotate • Pinch/scroll to zoom • Tap dots for details"
      : "रोटेट करने के लिए ड्रैग करें • ज़ूम करने के लिए पिंच करें • डॉट्स पर टैप करें",
    description: isEn
      ? "Explore your bike in 3D and learn about its maintenance and care."
      : "अपनी बाइक को 3D में जानें और उसके रखरखाव के बारे में जानें।",
    tip: isEn
      ? "Tip: Tap a hotspot to see maintenance intervals and prevention tips."
      : "टिप: हॉटस्पॉट पर टैप कर मेंटेनेंस इंटरवल और टिप्स देखें।",
  };

  const seoSchema = data?.metadata?.seo || {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title,
    description: metadata.description,
    isPartOf: { "@type": "WebSite", name: "Aashvi Automotive" },
  };

  return (
    <main
      className="
        relative flex flex-col items-center justify-start overflow-hidden
        min-h-screen
        bg-gradient-to-b from-[#0A1F4D] via-[#0B3B74] to-[#102B5E]
        text-white px-4 pt-[7rem] pb-10 md:pt-[8rem]
      "
    >
      {/* 🔹 SEO Helmet */}
      <SeoHelmet
        pageKey="know-your-bike"
        language={language}
        title={metadata.title}
        description={metadata.description}
        schema={seoSchema}
      />

      {/* 🔹 Header */}
      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">
          {metadata.title}
        </h1>
        <p className="text-sm md:text-base text-blue-100 mt-2">
          {metadata.subtitle}
        </p>
      </div>

      {/* 🏍️ 3D Viewer */}
      <div
        className="
          relative w-full max-w-7xl flex items-center justify-center
          h-[70vh] md:h-[75vh] lg:h-[80vh]
          rounded-3xl overflow-hidden
          bg-gradient-to-b from-[#E6ECF6] via-[#D5DFEF] to-[#C2D2EB]
          shadow-2xl border border-[#A9BFE2]/70
        "
      >
        <Suspense
          fallback={
            <div className="w-full h-full grid place-items-center bg-[#E6ECF6]">
              <motion.div
                initial={{ opacity: 0.4, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.8,
                }}
                className="h-16 w-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"
              />
            </div>
          }
        >
          {data && (
            <BikeStage
              language={language}
              model={data.model}
              hotspots={data.hotspots}
            />
          )}
        </Suspense>
      </div>

      {/* 🔸 Tip */}
      <p className="text-xs text-blue-100 mt-6 text-center max-w-xl leading-snug">
        {metadata.tip}
      </p>
    </main>
  );
}
