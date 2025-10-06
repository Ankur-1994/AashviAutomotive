import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { FaWhatsapp } from "react-icons/fa";

interface BookingProps {
  language: "en" | "hi";
}

const Booking = ({ language }: BookingProps) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bikeModel: "",
    serviceType: "",
    preferredDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        ...form,
        language,
        timestamp: serverTimestamp(),
      });

      // ✅ WhatsApp Notification to Workshop Owner
      const message = `New Booking Request 🚲%0A
Name: ${form.name}%0A
Phone: ${form.phone}%0A
Bike: ${form.bikeModel}%0A
Service: ${form.serviceType}%0A
Date: ${form.preferredDate}%0A
Notes: ${form.notes || "N/A"}`;

      window.open(`https://wa.me/919800000000?text=${message}`, "_blank");

      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        bikeModel: "",
        serviceType: "",
        preferredDate: "",
        notes: "",
      });
    } catch (err) {
      console.error("Booking submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-6 md:px-20">
      <Helmet>
        <title>
          {language === "en"
            ? "Book Service | Aashvi Automotive"
            : "सेवा बुक करें | आश्वी ऑटोमोटिव"}
        </title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B3B74] mb-6 text-center">
          {language === "en"
            ? "Book Your Bike Service"
            : "अपनी बाइक सर्विस बुक करें"}
        </h2>

        {success && (
          <div className="bg-green-100 text-green-800 px-4 py-3 mb-6 rounded-lg text-center font-medium">
            {language === "en"
              ? "Booking submitted successfully! We’ll contact you soon."
              : "बुकिंग सफलतापूर्वक जमा हो गई है! हम जल्द ही आपसे संपर्क करेंगे।"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">
              {language === "en" ? "Full Name" : "पूरा नाम"}
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              {language === "en" ? "Contact Number" : "संपर्क नंबर"}
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              {language === "en" ? "Bike Model" : "बाइक मॉडल"}
            </label>
            <input
              type="text"
              name="bikeModel"
              required
              value={form.bikeModel}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              {language === "en" ? "Service Type" : "सेवा प्रकार"}
            </label>
            <select
              name="serviceType"
              required
              value={form.serviceType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="">
                {language === "en" ? "Select..." : "चुनें..."}
              </option>
              <option value="Periodic Service">
                {language === "en" ? "Periodic Service" : "नियतकालिक सर्विस"}
              </option>
              <option value="General Repair">
                {language === "en" ? "General Repair" : "सामान्य मरम्मत"}
              </option>
              <option value="Washing">
                {language === "en" ? "Washing" : "वॉशिंग"}
              </option>
              <option value="Oil Change">
                {language === "en" ? "Oil Change" : "तेल बदलना"}
              </option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              {language === "en" ? "Preferred Date" : "पसंदीदा तारीख़"}
            </label>
            <input
              type="date"
              name="preferredDate"
              required
              value={form.preferredDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              {language === "en" ? "Additional Notes" : "अतिरिक्त नोट्स"}
            </label>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-[1.03] disabled:opacity-60"
            >
              {loading
                ? language === "en"
                  ? "Submitting..."
                  : "भेजा जा रहा है..."
                : language === "en"
                ? "Submit Booking"
                : "बुकिंग सबमिट करें"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <a
            href="https://wa.me/919800000000?text=Hello%20Aashvi%20Automotive%2C%20I%20want%20to%20book%20a%20bike%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 font-semibold hover:underline"
          >
            <FaWhatsapp />{" "}
            {language === "en"
              ? "Chat with us on WhatsApp"
              : "व्हाट्सएप पर हमसे चैट करें"}
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Booking;
