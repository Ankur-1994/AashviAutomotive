import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";

interface ServiceItem {
  icon: string;
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
}

interface ServicesSectionProps {
  language: "en" | "hi";
}

const ServicesSection = ({ language }: ServicesSectionProps) => {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const docRef = doc(db, "content", "services");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setServices(docSnap.data().items || []);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#0B3B74]/5 to-white text-gray-900">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#0B3B74] mb-4">
          {language === "en" ? "Our Services" : "हमारी सेवाएँ"}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === "en"
            ? "We provide all types of two-wheeler services with professional quality and affordable prices."
            : "हम सभी प्रकार की दोपहिया सेवाएँ प्रोफेशनल क्वालिटी और किफायती दामों पर प्रदान करते हैं।"}
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => {
          const IconComponent =
            (FaIcons as any)[service.icon] || FaIcons.FaCogs;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 text-center"
            >
              <div className="flex justify-center mb-4 text-orange-500">
                <IconComponent className="text-5xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0B3B74]">
                {language === "en" ? service.title_en : service.title_hi}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {language === "en" ? service.desc_en : service.desc_hi}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
