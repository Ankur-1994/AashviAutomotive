import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import SeoHelmet from "../components/SeoHelmet";

interface FaqItem {
  order: number;
  question_en: string;
  question_hi: string;
  answer_en: string;
  answer_hi: string;
}

interface FaqsProps {
  language: "en" | "hi";
}

const Faqs: React.FC<FaqsProps> = ({ language }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const fetchFaqs = async () => {
      try {
        // ✅ Lazy-load Firestore only when needed
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy-load Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const ref = doc(db, "content", "faqs");
        const snap = await getDoc(ref);

        if (!active || !snap.exists()) return;

        const data = snap.data();
        const lists = (data?.lists || []) as FaqItem[];

        const sortedFaqs = [...lists].sort((a, b) => a.order - b.order);
        setFaqs(sortedFaqs);

        // ✅ Cache FAQs in sessionStorage for instant reloads
        sessionStorage.setItem("faqs_data", JSON.stringify(sortedFaqs));
      } catch (e) {
        console.error("Error loading FAQs:", e);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Try to load from cache first for instant display
    const cached = sessionStorage.getItem("faqs_data");
    if (cached) {
      setFaqs(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchFaqs();
    }

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-b from-orange-50 via-white to-blue-50">
        <p className="text-gray-600 animate-pulse">
          {language === "hi" ? "लोड हो रहा है..." : "Loading FAQs..."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-orange-50 via-white to-blue-50 text-gray-900 min-h-screen overflow-hidden">
      {/* ✅ SEO Helmet */}
      <SeoHelmet
        pageKey="faqs"
        language={language}
        title={
          language === "en"
            ? "FAQs - Aashvi Automotive"
            : "अक्सर पूछे जाने वाले सवाल - आश्वी ऑटोमोटिव"
        }
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: language === "en" ? faq.question_en : faq.question_hi,
            acceptedAnswer: {
              "@type": "Answer",
              text: language === "en" ? faq.answer_en : faq.answer_hi,
            },
          })),
        }}
      />

      {/* 🌟 Hero Section */}
      <section className="relative text-center pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-28 overflow-hidden px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B3B74] mb-4 drop-shadow-sm leading-tight">
            {language === "hi"
              ? "अक्सर पूछे जाने वाले सवाल"
              : "Frequently Asked Questions"}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            {language === "hi"
              ? "हमारी सेवाओं, कीमतों और प्रक्रिया से संबंधित सामान्य प्रश्नों के उत्तर यहां पाएँ।"
              : "Find clear answers about our bike servicing, pricing, and repair process — all in one place."}
          </p>
        </motion.div>

        {/* Background blur glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 bg-orange-200/40 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/3 right-1/4 w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 bg-blue-200/40 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* 💬 FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 pb-16 sm:pb-20">
        <div className="space-y-4 sm:space-y-6">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={item.order}
                layout
                transition={{
                  layout: {
                    duration: 0.5,
                    ease: [0.25, 1, 0.5, 1],
                  },
                }}
                className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.07)] overflow-hidden transition-all"
              >
                <motion.button
                  layout
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-left"
                >
                  <motion.h3
                    layout
                    className="text-base sm:text-lg md:text-xl font-semibold text-[#0B3B74] leading-snug"
                  >
                    {language === "hi" ? item.question_hi : item.question_en}
                  </motion.h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <FaChevronDown className="text-orange-500 text-lg sm:text-xl" />
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      layout
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        opacity: { duration: 0.25 },
                        layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                      }}
                      className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 text-gray-700 leading-relaxed bg-gradient-to-b from-white to-orange-50/40 text-sm sm:text-base"
                    >
                      {language === "hi" ? item.answer_hi : item.answer_en}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 💡 CTA Section */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-r from-orange-100 via-orange-50 to-blue-50 text-center rounded-t-3xl shadow-inner mx-4 sm:mx-8 md:mx-12 lg:mx-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-4 sm:px-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B3B74] mb-3 sm:mb-4 leading-tight">
            {language === "hi" ? "अभी भी सवाल हैं?" : "Still have questions?"}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            {language === "hi"
              ? "हमसे व्हाट्सएप पर बात करें या अपनी सर्विस बुक करें — हम आपकी मदद के लिए हमेशा तैयार हैं!"
              : "Chat with us on WhatsApp or book your bike service — we’re always happy to help!"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href="https://wa.me/919229768624"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 text-center"
            >
              {language === "hi" ? "व्हाट्सएप पर बात करें" : "Chat on WhatsApp"}
            </a>
            <a
              href="/booking"
              className="w-full sm:w-auto px-6 py-3 bg-[#0B3B74] hover:bg-[#0a3363] text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 text-center"
            >
              {language === "hi" ? "सर्विस बुक करें" : "Book a Service"}
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Faqs;
