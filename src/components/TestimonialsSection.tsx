import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { motion } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";

interface Testimonial {
  name: string;
  rating: number;
  review_en: string;
  review_hi: string;
}

interface TestimonialsSectionProps {
  language: "en" | "hi";
}

const TestimonialsSection = ({ language }: TestimonialsSectionProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const docRef = doc(db, "content", "testimonials");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTestimonials(docSnap.data().reviews || []);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    fetchTestimonials();
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#0B3B74]/5 to-white text-gray-900">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#0B3B74] mb-3">
          {language === "en"
            ? "What Our Customers Say"
            : "हमारे ग्राहक क्या कहते हैं"}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === "en"
            ? "Real feedback from our happy customers across Rajnagar and Madhubani."
            : "राजनगर और मधुबनी के हमारे खुश ग्राहकों की सच्ची प्रतिक्रियाएँ।"}
        </p>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
          >
            <div className="flex justify-center mb-3 text-orange-400">
              {Array.from({ length: 5 }).map((_, i) =>
                i < t.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
              )}
            </div>
            <p className="text-gray-700 text-sm italic mb-4 leading-relaxed">
              “{language === "en" ? t.review_en : t.review_hi}”
            </p>
            <h4 className="text-[#0B3B74] font-semibold text-center">
              — {t.name}
            </h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
