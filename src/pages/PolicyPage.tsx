import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import SeoHelmet from "../components/SeoHelmet";
import { motion } from "framer-motion";

interface LegalPolicy {
  terms_en: string;
  terms_hi: string;
  privacy_en: string;
  privacy_hi: string;
  refund_en: string;
  refund_hi: string;
}

interface PolicyPageProps {
  language: "en" | "hi";
}

const PolicyPage: React.FC<PolicyPageProps> = ({ language }) => {
  const [policy, setPolicy] = useState<LegalPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const path = location.pathname.replace("/", "");
  const keyMap = {
    terms: {
      en: "terms_en",
      hi: "terms_hi",
      title_en: "Terms & Conditions",
      title_hi: "नियम और शर्तें",
    },
    privacy: {
      en: "privacy_en",
      hi: "privacy_hi",
      title_en: "Privacy Policy",
      title_hi: "गोपनीयता नीति",
    },
    refunds: {
      en: "refund_en",
      hi: "refund_hi",
      title_en: "Refund & Cancellation Policy",
      title_hi: "रिफंड और रद्दीकरण नीति",
    },
  } as const;

  const activeKey = keyMap[path as keyof typeof keyMap];

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const snap = await getDoc(doc(db, "content", "legal_policies"));
        if (snap.exists()) setPolicy(snap.data() as LegalPolicy);
      } catch (e) {
        console.error("Failed to fetch policy:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          {language === "hi" ? "लोड हो रहा है..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (!policy || !activeKey) {
    return (
      <div className="text-center py-20 text-gray-500">
        {language === "hi"
          ? "नीति की जानकारी उपलब्ध नहीं है।"
          : "Policy information not available."}
      </div>
    );
  }

  const content =
    language === "en"
      ? policy[activeKey.en as keyof LegalPolicy]
      : policy[activeKey.hi as keyof LegalPolicy];

  const title = language === "en" ? activeKey.title_en : activeKey.title_hi;

  return (
    <div className="bg-white text-gray-900">
      {/* SEO Helmet */}
      <SeoHelmet
        pageKey={path}
        language={language}
        title={title}
        description={
          language === "en"
            ? `${activeKey.title_en} for Aashvi Automotive`
            : `आश्वी ऑटोमोटिव की ${activeKey.title_hi}`
        }
      />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-[#F8FAFC] via-white to-[#FFF7ED] pt-28 pb-16 text-center overflow-hidden">
        {/* Glow shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-[#0B3B74] relative z-10"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-3 text-gray-600 text-base md:text-lg relative z-10"
        >
          {language === "en"
            ? "Please read the following details carefully."
            : "कृपया नीचे दी गई जानकारी ध्यानपूर्वक पढ़ें।"}
        </motion.p>
      </section>

      {/* POLICY CONTENT */}
      <motion.section
        className="max-w-5xl mx-auto px-6 md:px-10 py-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="
      prose
      max-w-none
      text-justify
      leading-relaxed
      text-[16.5px]
      prose-headings:font-bold
      prose-headings:text-[#0B3B74]
      prose-h2:text-2xl
      prose-h3:text-xl
      prose-h4:text-lg
      prose-p:text-gray-700
      prose-a:text-orange-500
      prose-a:underline
      prose-li:marker:text-orange-500
      prose-ul:list-disc
      prose-ol:list-decimal
      prose-strong:text-gray-900
      animate-policy
    "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.section>
    </div>
  );
};

export default PolicyPage;
