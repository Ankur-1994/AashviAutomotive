import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import SeoHelmet from "../components/SeoHelmet";

interface ContactData {
  title_en: string;
  title_hi: string;
  desc_en: string;
  desc_hi: string;
  phone: string;
  whatsapp: string;
  email: string;
  address_en: string;
  address_hi: string;
  google_map_embed: string;
  hours_en: string;
  hours_hi: string;
}

interface ContactSectionProps {
  language: "en" | "hi";
}

const ContactSection = ({ language }: ContactSectionProps) => {
  const [contact, setContact] = useState<ContactData | null>(null);

  useEffect(() => {
    let active = true;

    const fetchContact = async () => {
      try {
        // ✅ Lazy-load Firebase Firestore
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy import Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const docRef = doc(db, "content", "contact");
        const docSnap = await getDoc(docRef);

        if (!active || !docSnap.exists()) return;

        const data = docSnap.data() as ContactData;
        setContact(data);

        // ✅ Cache for faster next load
        sessionStorage.setItem("contact_data", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching contact info:", err);
      }
    };

    // ✅ Use cached data if present
    const cached = sessionStorage.getItem("contact_data");
    if (cached) {
      setContact(JSON.parse(cached));
    } else {
      fetchContact();
    }

    return () => {
      active = false;
    };
  }, []);

  if (!contact) return null;

  const isEn = language === "en";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDF5EF] to-[#0B3B74]/5 py-16 sm:py-20 md:py-24 px-4 sm:px-10 md:px-16 lg:px-20">
      {/* 🔹 SEO Meta */}
      <SeoHelmet
        pageKey="contact"
        language={language}
        title={language === "en" ? "Contact Us" : "संपर्क करें"}
        schema={{
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          name: "Aashvi Automotive",
          image:
            "https://cdn.jsdelivr.net/gh/Ankur-1994/AashviAutomotive@main/src/assets/logo.jpeg",
          telephone: "+919229768624",
          email: "aashviautomotive2025@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Ground Floor, Rishikesh Complex, Simri Dih Chowk, Near Hatiyagachi",
            addressLocality: "Rajnagar",
            addressRegion: "Madhubani",
            postalCode: "847235",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 26.3841554,
            longitude: 86.1427815,
          },
          openingHours: ["Mon-Sun 09:00-18:00"],
          url: "https://aashviautomotive.in/",
          sameAs: [
            "https://www.facebook.com/profile.php?id=61580076237855",
            "https://wa.me/919229768624",
            "https://instagram.com/aashviautomotive",
            "https://aashviautomotive.in",
            "https://youtube.com/@aashviautomotive",
          ],
        }}
      />

      {/* 🔹 Background Glows */}
      <div className="absolute top-0 left-0 w-48 sm:w-60 h-48 sm:h-60 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-60 sm:w-72 h-60 sm:h-72 bg-blue-800/10 rounded-full blur-3xl" />

      {/* 🔹 Main Layout */}
      <div className="max-w-6xl mx-auto flex flex-col xl:flex-row items-center xl:items-start justify-center gap-16 relative z-10">
        {/* LEFT: Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-lg flex flex-col items-center xl:items-start text-center xl:text-left"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B3B74] mb-3 leading-tight">
            {isEn ? contact.title_en : contact.title_hi}
          </h2>

          <p className="text-gray-700 mb-8 text-base sm:text-lg leading-relaxed max-w-md mx-auto xl:mx-0">
            {isEn ? contact.desc_en : contact.desc_hi}
          </p>

          {/* 🔹 Contact Details */}
          <div className="space-y-4 mb-8 text-gray-800 w-full flex flex-col items-center xl:items-start">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-start justify-center xl:justify-start gap-3 text-sm sm:text-base leading-snug text-gray-700 max-w-xs sm:max-w-none"
            >
              <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
              <p className="text-center xl:text-left">
                {isEn ? contact.address_en : contact.address_hi}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center xl:justify-start gap-3"
            >
              <FaPhoneAlt className="text-orange-500 flex-shrink-0" />
              <a
                href={`tel:${contact.phone}`}
                className="hover:underline text-sm sm:text-base"
              >
                {contact.phone}
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center xl:justify-start gap-3"
            >
              <FaEnvelope className="text-orange-500 flex-shrink-0" />
              <a
                href={`mailto:${contact.email}`}
                className="hover:underline text-sm sm:text-base break-all"
              >
                {contact.email}
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center xl:justify-start gap-3"
            >
              <FaWhatsapp className="text-green-600 flex-shrink-0" />
              <a
                href={`https://wa.me/${contact.whatsapp.replace(
                  /\D/g,
                  ""
                )}?text=Hello%20Aashvi%20Automotive%2C%20I%20want%20to%20book%20a%20bike%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-medium text-sm sm:text-base"
              >
                {isEn ? "Chat on WhatsApp" : "व्हाट्सएप पर चैट करें"}
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center xl:justify-start gap-3"
            >
              <FaClock className="text-orange-500 flex-shrink-0" />
              <span className="font-semibold text-sm sm:text-base">
                {isEn ? contact.hours_en : contact.hours_hi}
              </span>
            </motion.div>
          </div>

          {/* 🔹 CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start w-full sm:w-auto">
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-lg shadow-md transition-all w-full sm:w-auto text-center"
            >
              {isEn ? "WhatsApp Now" : "अभी व्हाट्सएप करें"}
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-lg shadow-md transition-all w-full sm:w-auto text-center"
            >
              {isEn ? "Call Us" : "हमें कॉल करें"}
            </a>
          </div>
        </motion.div>

        {/* 🔹 RIGHT: Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full max-w-xl mx-auto xl:mx-0"
        >
          <div className="rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-orange-200 transition-all duration-500">
            <iframe
              src={contact.google_map_embed}
              width="100%"
              height="400"
              loading="lazy"
              className="w-full h-[350px] sm:h-[400px] rounded-2xl"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
