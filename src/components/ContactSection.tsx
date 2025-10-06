import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

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

  return (
    <section className="py-20 px-6 md:px-20 bg-[#0B3B74]/5 text-gray-900">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B3B74] mb-4">
            {language === "en" ? contact.title_en : contact.title_hi}
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {language === "en" ? contact.desc_en : contact.desc_hi}
          </p>

          <div className="space-y-3 mb-6 text-gray-800">
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-orange-500" />
              {language === "en" ? contact.address_en : contact.address_hi}
            </p>
            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-orange-500" />
              <a href={`tel:${contact.phone}`} className="hover:underline">
                {contact.phone}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <FaEnvelope className="text-orange-500" />
              <a href={`mailto:${contact.email}`} className="hover:underline">
                {contact.email}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <FaWhatsapp className="text-green-600" />
              <a
                href={`https://wa.me/${contact.whatsapp.replace(
                  /\D/g,
                  ""
                )}?text=Hello%20Aashvi%20Automotive%2C%20I%20want%20to%20book%20a%20bike%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {language === "en"
                  ? "Chat on WhatsApp"
                  : "व्हाट्सएप पर चैट करें"}
              </a>
            </p>
          </div>

          <p className="font-semibold text-[#0B3B74]">
            {language === "en" ? contact.hours_en : contact.hours_hi}
          </p>
        </motion.div>

        {/* Right: Google Map */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <iframe
            src={contact.google_map_embed}
            width="100%"
            height="350"
            loading="lazy"
            className="rounded-2xl shadow-lg border-0 w-full"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
