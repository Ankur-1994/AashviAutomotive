import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
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
    const fetchContact = async () => {
      try {
        const docRef = doc(db, "content", "contact");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContact(docSnap.data() as ContactData);
        }
      } catch (err) {
        console.error("Error fetching contact info:", err);
      }
    };
    fetchContact();
  }, []);

  if (!contact) return null;

  const isEn = language === "en";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FDF5EF] to-[#0B3B74]/5 py-20 px-6 md:px-20">
      {/* 🔹 SEO Meta */}
      <SeoHelmet
        pageKey="contact"
        language={language}
        title={language === "en" ? "Contact Us" : "संपर्क करें"}
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Aashvi Automotive",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Rishikesh Complex, Simri Dih Chowk, Rajnagar, Madhubani",
            addressRegion: "Bihar",
            postalCode: "847235",
            addressCountry: "IN",
          },
          telephone: "+91 9229768624",
          url: "https://aashviautomotive.web.app/",
        }}
      />

      {/* 🔹 Background Accents */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-800/10 rounded-full blur-3xl"></div>

      {/* 🔹 Layout */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* LEFT: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B3B74] mb-4">
            {isEn ? contact.title_en : contact.title_hi}
          </h2>

          <p className="text-gray-700 mb-8 text-base md:text-lg leading-relaxed">
            {isEn ? contact.desc_en : contact.desc_hi}
          </p>

          {/* Contact Details */}
          <div className="space-y-4 mb-8 text-gray-800">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-3"
            >
              <FaMapMarkerAlt className="text-orange-500 mt-1" />
              <p>{isEn ? contact.address_en : contact.address_hi}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <FaPhoneAlt className="text-orange-500" />
              <a href={`tel:${contact.phone}`} className="hover:underline">
                {contact.phone}
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <FaEnvelope className="text-orange-500" />
              <a href={`mailto:${contact.email}`} className="hover:underline">
                {contact.email}
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <FaWhatsapp className="text-green-600" />
              <a
                href={`https://wa.me/${contact.whatsapp.replace(
                  /\D/g,
                  ""
                )}?text=Hello%20Aashvi%20Automotive%2C%20I%20want%20to%20book%20a%20bike%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-medium"
              >
                {isEn ? "Chat on WhatsApp" : "व्हाट्सएप पर चैट करें"}
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <FaClock className="text-orange-500" />
              <span className="font-semibold">
                {isEn ? contact.hours_en : contact.hours_hi}
              </span>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition-all"
            >
              {isEn ? "WhatsApp Now" : "अभी व्हाट्सएप करें"}
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition-all"
            >
              {isEn ? "Call Us" : "हमें कॉल करें"}
            </a>
          </div>
        </motion.div>

        {/* RIGHT: Google Map */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-orange-200 transition-all duration-500">
            <iframe
              src={contact.google_map_embed}
              width="100%"
              height="400"
              loading="lazy"
              className="w-full h-[400px]"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
