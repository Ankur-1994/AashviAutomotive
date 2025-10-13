import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SeoHelmet from "../components/SeoHelmet";

export default function NotFound({ language = "en" as "en" | "hi" }) {
  const isEn = language === "en";

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6 bg-gradient-to-br from-[#F8FAFC] to-[#E8EEF6]">
      <SeoHelmet
        pageKey="404"
        language={language}
        title={isEn ? "Page Not Found" : "पेज नहीं मिला"}
        description={
          isEn
            ? "The page you're looking for doesn't exist."
            : "आप जिस पेज को ढूंढ रहे हैं वह उपलब्ध नहीं है।"
        }
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: isEn ? "404 Not Found" : "404 नहीं मिला",
          isPartOf: { "@type": "WebSite", name: "Aashvi Automotive" },
        }}
      />

      {/* Floating gradient orbs (background decorations) */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full bg-orange-100 blur-3xl opacity-30 top-[-100px] left-[-120px] -z-10"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full bg-blue-100 blur-3xl opacity-30 bottom-[-100px] right-[-80px] -z-10"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 404 Title */}
      <motion.h1
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[100px] md:text-[140px] font-extrabold text-[#0B3B74] drop-shadow-sm select-none leading-none"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-700 text-base sm:text-lg md:text-xl max-w-lg mt-4 leading-relaxed"
      >
        {isEn
          ? "Oops! The page you’re looking for doesn’t exist or has been moved."
          : "अरे! आप जिस पेज की तलाश कर रहे हैं, वह मौजूद नहीं है या उसे हटा दिया गया है।"}
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-4 justify-center mt-8"
      >
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm sm:text-base font-medium shadow-md transition-transform hover:scale-[1.03]"
        >
          {isEn ? "Go to Home" : "होम पर जाएं"}
        </Link>
        <Link
          to="/contact"
          className="border border-orange-400 text-orange-600 hover:bg-orange-50 px-6 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-transform hover:scale-[1.03]"
        >
          {isEn ? "Contact us" : "हमसे संपर्क करें"}
        </Link>
      </motion.div>

      {/* Optional: extra note */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1 }}
        className="text-xs sm:text-sm text-gray-500 mt-10"
      >
        {isEn
          ? "You can report broken links via our Contact page."
          : "टूटी हुई लिंक के लिए कृपया संपर्क पेज पर बताएं।"}
      </motion.span>
    </main>
  );
}
