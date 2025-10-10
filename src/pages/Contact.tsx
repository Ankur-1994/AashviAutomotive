import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import SeoHelmet from "../components/SeoHelmet";

interface ContactContent {
  heading_en: string;
  heading_hi: string;
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
  cta_text: string;
}

interface ContactProps {
  language: "en" | "hi";
}

const Contact = ({ language }: ContactProps) => {
  const [contactData, setContactData] = useState<ContactContent | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  useEffect(() => {
    let active = true;

    const fetchContactData = async () => {
      try {
        // ✅ Lazy-load Firestore only when needed
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy import Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const docRef = doc(db, "content", "contact");
        const docSnap = await getDoc(docRef);

        if (!active || !docSnap.exists()) return;

        const data = docSnap.data() as ContactContent;
        setContactData(data);

        // ✅ Cache in sessionStorage for fast reloads
        sessionStorage.setItem("contact_data", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching contact data:", err);
      }
    };

    // ✅ Try cache first for instant page load
    const cached = sessionStorage.getItem("contact_data");
    if (cached) {
      setContactData(JSON.parse(cached));
    } else {
      fetchContactData();
    }

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    try {
      setStatus("sending");
      const { getDb } = await import("../services/firebaseLazy");
      const db = await getDb();
      const { collection, addDoc, Timestamp } = await import(
        "firebase/firestore"
      );
      await addDoc(collection(db, "contact_requests"), {
        ...form,
        createdAt: Timestamp.now(),
      });
      // Send Email via EmailJS
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT!,
        {
          name: form.name,
          phone: form.phone,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );
      console.log("📧 EmailJS response:", response);
      setForm({ name: "", phone: "", message: "" });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    }
  };

  if (!contactData)
    return <div className="text-center py-20 text-gray-600">Loading...</div>;

  const [ctaEn, ctaHi] = contactData.cta_text
    ? contactData.cta_text.split("/").map((s) => s.trim())
    : ["Chat on WhatsApp", "व्हाट्सएप पर बात करें"];

  return (
    <div className="bg-white text-gray-900">
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
              language === "en"
                ? contactData.address_en
                : contactData.address_hi,
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
        }}
      />

      {/* 🌟 Hero Section with Animated Gradient */}
      <section className="relative h-[320px] md:h-[420px] lg:h-[460px] overflow-hidden text-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 animate-gradientMove bg-[length:400%_400%] bg-gradient-to-r from-[#0B3B74] via-[#144b9e] via-[#ff7e3d] to-[#0B3B74] opacity-95"></div>

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Hero Content — true center alignment */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6 md:px-10 z-10">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow-md"
          >
            {language === "en"
              ? contactData.heading_en
              : contactData.heading_hi}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-2xl mx-auto text-base md:text-lg text-gray-200 leading-relaxed"
          >
            {language === "en" ? contactData.desc_en : contactData.desc_hi}
          </motion.p>
        </div>
      </section>

      {/* 🧭 Main Contact Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 sm:px-8 md:px-12 lg:px-20 flex flex-col md:flex-row gap-10 md:gap-12 items-stretch">
        {/* Left - Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex-1 bg-gradient-to-br from-orange-50 via-white to-blue-50 
                       rounded-2xl shadow-md md:shadow-lg border border-gray-100 
                       p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-semibold text-[#0B3B74] mb-6">
              {language === "en" ? contactData.title_en : contactData.title_hi}
            </h2>
            <div className="space-y-4 text-gray-700 text-base leading-relaxed">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-500 mt-1" />
                <p>
                  {language === "en"
                    ? contactData.address_en
                    : contactData.address_hi}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-orange-500" />
                <a
                  href={`tel:${contactData.phone}`}
                  className="hover:text-orange-600 transition-colors"
                >
                  {contactData.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-orange-500" />
                <a
                  href={`mailto:${contactData.email}`}
                  className="hover:text-orange-600 transition-colors break-all"
                >
                  {contactData.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-green-600" />
                <a
                  href={`https://wa.me/${contactData.whatsapp.replace(
                    /\D/g,
                    ""
                  )}?text=Hello%20Aashvi%20Automotive%2C%20I%20want%20to%20book%20a%20bike%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-700 transition-colors"
                >
                  {language === "en" ? ctaEn : ctaHi}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-orange-500" />
                <p>
                  {language === "en"
                    ? contactData.hours_en
                    : contactData.hours_hi}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Map + Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 flex flex-col gap-6"
        >
          {/* Map */}
          <div className="overflow-hidden rounded-2xl shadow-md md:shadow-lg border border-gray-200 h-[260px] sm:h-[300px]">
            <iframe
              src={contactData.google_map_embed}
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              className="border-0"
            ></iframe>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md md:shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-[#0B3B74] mb-4">
              {language === "en" ? "Send us a message" : "हमें संदेश भेजें"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                // validation before calling your existing handleSubmit
                let isValid = true;

                if (!form.name.trim()) {
                  setNameError(
                    language === "en"
                      ? "Please enter your name"
                      : "कृपया अपना नाम दर्ज करें"
                  );
                  isValid = false;
                } else {
                  setNameError("");
                }

                if (!form.phone.trim() || form.phone.length < 10) {
                  setPhoneError(
                    language === "en"
                      ? "Please enter a valid 10-digit mobile number"
                      : "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें"
                  );
                  isValid = false;
                } else {
                  setPhoneError("");
                }

                if (!isValid) return;

                // ✅ valid form — call your existing function
                handleSubmit(e);
              }}
              className="space-y-4"
              noValidate
            >
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={language === "en" ? "Your Name" : "आपका नाम"}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 outline-none text-base transition ${
                    nameError
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400"
                  }`}
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (nameError && e.target.value.trim() !== "") {
                      setNameError("");
                    }
                  }}
                />
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  onInput={(e) => {
                    const value = e.currentTarget.value.replace(/\D/g, "");
                    if (value.length <= 10) setForm({ ...form, phone: value });
                    if (phoneError && value.length === 10) {
                      setPhoneError("");
                    }
                  }}
                  placeholder={
                    language === "en"
                      ? "10-digit Mobile Number"
                      : "10 अंकों का मोबाइल नंबर"
                  }
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 outline-none text-base transition ${
                    phoneError
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400"
                  }`}
                  value={form.phone}
                />

                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              {/* Message Field */}
              <textarea
                placeholder={
                  language === "en"
                    ? "How can we help you?"
                    : "हम आपकी कैसे मदद कर सकते हैं?"
                }
                className="w-full border rounded-lg px-4 py-3 h-28 resize-none focus:ring-2 focus:ring-orange-400 outline-none text-base transition"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 
               text-white py-3 rounded-lg font-semibold 
               hover:from-orange-600 hover:to-orange-700 
               transition-all duration-300 disabled:opacity-80"
              >
                {status === "sending"
                  ? "Sending..."
                  : language === "en"
                  ? "Submit"
                  : "सबमिट करें"}
              </button>

              {status === "success" && (
                <p className="text-green-600 text-center font-medium mt-2">
                  {language === "en"
                    ? "Message sent successfully!"
                    : "संदेश सफलतापूर्वक भेजा गया!"}
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-center font-medium mt-2">
                  {language === "en"
                    ? "Something went wrong. Please try again."
                    : "कुछ गलत हो गया। कृपया पुनः प्रयास करें।"}
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${contactData.whatsapp.replace(
          /\D/g,
          ""
        )}?text=Hello%20Aashvi%20Automotive%2C%20I%20want%20to%20book%20a%20bike%20service.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 
                     bg-green-600 hover:bg-green-700 text-white 
                     p-3 sm:p-4 rounded-full shadow-lg z-50 
                     transition-transform hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-2xl sm:text-3xl" />
      </a>
    </div>
  );
};

export default Contact;
