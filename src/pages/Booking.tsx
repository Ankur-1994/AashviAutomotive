import { useEffect, useMemo, useRef, useState } from "react";
import { doc, getDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaRegCalendarAlt } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import SeoHelmet from "../components/SeoHelmet";
import emailjs from "@emailjs/browser";

interface BookingContent {
  hero_title_en: string;
  hero_title_hi: string;
  hero_desc_en: string;
  hero_desc_hi: string;
  hero_image: string;
  form_title_en: string;
  form_title_hi: string;
  success_msg_en: string;
  success_msg_hi: string;
}

interface BookingForm {
  name: string;
  phone: string;
  brand: string;
  vehicle: string;
  serviceType: string;
  date: string;
  message: string;
}

interface BookingProps {
  language: "en" | "hi";
}

interface ServiceType {
  id: number;
  name_en: string;
  name_hi: string;
}

const Booking = ({ language }: BookingProps) => {
  const [content, setContent] = useState<BookingContent | null>(null);
  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    brand: "",
    vehicle: "",
    serviceType: "",
    date: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showServiceType, setShowServiceType] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);

  // track touched fields + submit attempt for clean inline validation
  const [touched, setTouched] = useState<Record<keyof BookingForm, boolean>>({
    name: false,
    phone: false,
    brand: false,
    vehicle: false,
    serviceType: false,
    date: false,
    message: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isEn = language === "en";

  /* Close popup on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowServiceType(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----- fetch page content -----
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const snap = await getDoc(doc(db, "content", "bookings"));
        if (snap.exists()) {
          const data = snap.data();
          setContent(data as BookingContent);
          if (Array.isArray(data.service_types)) {
            setServiceTypes(data.service_types);
          }
        }
      } catch (err) {
        console.error("Error loading booking content:", err);
      }
    };
    fetchContent();
  }, []);

  // ----- local (IST-safe) min date string YYYY-MM-DD -----
  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`; // local date, avoids UTC off-by-one
  }, []);

  // ----- validation -----
  const errors = useMemo(() => {
    const e: Partial<Record<keyof BookingForm, string>> = {};
    if (!form.name.trim()) e.name = isEn ? "Name is required" : "नाम आवश्यक है";
    if (!/^\d{10}$/.test(form.phone))
      e.phone = isEn ? "Enter 10-digit number" : "10 अंकों का नंबर दर्ज करें";
    if (!form.brand.trim())
      e.brand = isEn ? "Brand is required" : "ब्रांड आवश्यक है";
    if (!form.vehicle.trim())
      e.vehicle = isEn ? "Model is required" : "मॉडल आवश्यक है";
    if (!form.serviceType)
      e.serviceType = isEn ? "Select a service" : "सेवा चुनें";
    if (!form.date) {
      e.date = isEn ? "Select a date" : "तारीख चुनें";
    } else if (form.date < minDate) {
      e.date = isEn ? "Past dates not allowed" : "पिछली तारीख़ चुनना संभव नहीं";
    }
    return e;
  }, [form, isEn, minDate]);

  // ----- handlers -----
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const markTouched = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // if any error -> prevent submit
    if (Object.keys(errors).length > 0) {
      // optionally, scroll to first error
      const firstErrorKey = Object.keys(errors)[0] as keyof BookingForm;
      const el = document.querySelector(
        `[name="${firstErrorKey}"]`
      ) as HTMLElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "bookings"), {
        ...form,
        createdAt: Timestamp.now(),
      });

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_BOOKING!,
        {
          name: form.name,
          phone: form.phone,
          brand: form.brand,
          model: form.vehicle,
          serviceType: form.serviceType,
          preferredDate: form.date,
          message: form.message || "N/A",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      console.log("📧 Booking email response:", response);
      setSubmitted(true);
      setForm({
        name: "",
        phone: "",
        brand: "",
        vehicle: "",
        serviceType: "",
        date: "",
        message: "",
      });
      setTouched({
        name: false,
        phone: false,
        brand: false,
        vehicle: false,
        serviceType: false,
        date: false,
        message: false,
      });
      setSubmitAttempted(false);
    } catch (err) {
      console.error("Error submitting booking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!content)
    return (
      <div className="text-center py-40 text-gray-500 text-lg">Loading...</div>
    );

  return (
    <div className="font-sans text-gray-900">
      <SeoHelmet
        pageKey="booking"
        language={language}
        title={language === "en" ? "Book Service" : "सर्विस बुक करें"}
        schema={{
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          name: "Aashvi Automotive",
          parentOrganization: "Service Force",
          areaServed: {
            "@type": "AdministrativeArea",
            name: "Rajnagar, Madhubani, Bihar, India",
          },
          potentialAction: {
            "@type": "ScheduleAction",
            target: "/booking",
            name:
              language === "en"
                ? "Book two-wheeler service"
                : "टू-व्हीलर सर्विस बुक करें",
          },
        }}
      />

      {/* hero */}
      <section
        className="relative min-h-[60vh] flex flex-col justify-center items-center text-center text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${content.hero_image})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {isEn ? content.hero_title_en : content.hero_title_hi}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            {isEn ? content.hero_desc_en : content.hero_desc_hi}
          </p>
        </motion.div>
      </section>

      {/* form */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-white via-[#FDF5EF] to-white">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#0B3B74] mb-6 text-center">
            {isEn ? content.form_title_en : content.form_title_hi}
          </h2>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-green-600 text-lg font-medium"
            >
              {isEn ? content.success_msg_en : content.success_msg_hi}
            </motion.p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-6"
              noValidate
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEn ? "Full Name" : "पूरा नाम"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={markTouched}
                  placeholder={isEn ? "Your full name" : "अपना पूरा नाम"}
                  className={`border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 outline-none transition ${
                    (touched.name || submitAttempted) && errors.name
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
                {(touched.name || submitAttempted) && errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEn ? "Phone Number" : "फ़ोन नंबर"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  pattern="\d{10}"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={markTouched}
                  placeholder={
                    isEn ? "10-digit mobile number" : "10 अंकों का मोबाइल नंबर"
                  }
                  className={`border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 outline-none transition ${
                    (touched.phone || submitAttempted) && errors.phone
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
                {(touched.phone || submitAttempted) && errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Brand FIRST */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEn ? "Brand" : "ब्रांड"}
                </label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  onBlur={markTouched}
                  placeholder={
                    isEn
                      ? "e.g., Honda, Hero, TVS"
                      : "जैसे, होंडा, हीरो, टीवीएस"
                  }
                  className={`border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 outline-none transition ${
                    (touched.brand || submitAttempted) && errors.brand
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
                {(touched.brand || submitAttempted) && errors.brand && (
                  <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
                )}
              </div>

              {/* Vehicle Model SECOND */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEn ? "Vehicle Model" : "वाहन मॉडल"}
                </label>
                <input
                  type="text"
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  onBlur={markTouched}
                  placeholder={isEn ? "e.g., Activa 6G" : "जैसे, एक्टिवा 6G"}
                  className={`border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 outline-none transition ${
                    (touched.vehicle || submitAttempted) && errors.vehicle
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
                {(touched.vehicle || submitAttempted) && errors.vehicle && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicle}</p>
                )}
              </div>

              {/* Service Type */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEn ? "Service Type" : "सेवा का प्रकार"}
                </label>

                <div
                  onClick={() => setShowServiceType((prev) => !prev)}
                  className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                    (touched.serviceType || submitAttempted) &&
                    errors.serviceType
                      ? "border-red-400"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <span
                    className={`${
                      form.serviceType ? "text-gray-800" : "text-gray-500"
                    } text-base font-normal tracking-wide`}
                    style={{ fontFamily: "inherit" }}
                  >
                    {form.serviceType
                      ? form.serviceType
                      : isEn
                      ? "Select service type"
                      : "सेवा का प्रकार चुनें"}
                  </span>
                  <FaChevronDown
                    className={`transition-transform ${
                      showServiceType
                        ? "rotate-180 text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {showServiceType && (
                    <motion.ul
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-full max-h-64 overflow-y-auto"
                    >
                      {serviceTypes.map((option) => (
                        <li
                          key={option.id}
                          onClick={() => {
                            const value = isEn
                              ? option.name_en
                              : option.name_hi;
                            setForm((f) => ({ ...f, serviceType: value }));
                            setTouched((t) => ({ ...t, serviceType: true }));
                            setShowServiceType(false);
                          }}
                          className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition-colors text-gray-800"
                        >
                          {isEn ? option.name_en : option.name_hi}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {(touched.serviceType || submitAttempted) &&
                  errors.serviceType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.serviceType}
                    </p>
                  )}
              </div>

              {/* Preferred Date (custom calendar) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative" ref={calendarRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEn ? "Preferred Date" : "पसंदीदा तारीख"}
                  </label>

                  {/* Clickable Field */}
                  <div
                    onClick={() => setShowCalendar((prev) => !prev)}
                    className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                      (touched.date || submitAttempted) && errors.date
                        ? "border-red-400"
                        : "border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    <span
                      className={`${
                        form.date ? "text-gray-800" : "text-gray-500 italic"
                      } select-none`}
                    >
                      {form.date
                        ? new Date(form.date + "T00:00:00").toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : isEn
                        ? "Select your preferred service date"
                        : "अपनी पसंदीदा तारीख़ चुनें"}
                    </span>
                    <FaRegCalendarAlt className="text-gray-500" />
                  </div>

                  {(touched.date || submitAttempted) && errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}

                  {/* Calendar Popup */}
                  <AnimatePresence>
                    {showCalendar && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="absolute z-50 mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 p-3"
                      >
                        <DayPicker
                          mode="single"
                          selected={
                            form.date
                              ? new Date(form.date + "T00:00:00")
                              : undefined
                          }
                          onSelect={(d) => {
                            if (!d) return;
                            const local = new Date(
                              d.getFullYear(),
                              d.getMonth(),
                              d.getDate()
                            );
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            if (local < today) return; // block past days

                            const iso = `${local.getFullYear()}-${String(
                              local.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                              local.getDate()
                            ).padStart(2, "0")}`;
                            setForm((f) => ({ ...f, date: iso }));
                            setTouched((t) => ({ ...t, date: true }));
                            setShowCalendar(false);
                          }}
                          /* ❌ make past days unclickable + faded */
                          modifiers={{ disabled: { before: new Date() } }}
                          modifiersStyles={{
                            disabled: { opacity: 0.3, pointerEvents: "none" },
                            selected: {
                              backgroundColor: "#f97316", // ✅ Aashvi Orange
                              color: "#fff",
                              fontWeight: 700,
                              borderRadius: "8px",
                            },
                          }}
                          /* ✅ force theme to orange + remove blue ring */
                          style={{
                            ["--rdp-accent-color" as any]: "#f97316",
                            ["--rdp-accent-background-color" as any]: "#f97316",
                            ["--rdp-outline" as any]: "0", // remove focus ring
                            ["--rdp-outline-selected" as any]: "0", // remove selected ring
                          }}
                          /* ✅ brand styling; no blue border for 'today' */
                          styles={{
                            caption: { color: "#0B3B74", fontWeight: 600 },
                            nav_button: { color: "#0B3B74" },
                            head_cell: {
                              color: "#0B3B74",
                              fontWeight: 600,
                              borderBottom: "1px solid #E5E7EB",
                            },
                            day: {
                              color: "#1f2937",
                              borderRadius: "8px",
                              margin: "2px",
                            },
                            day_today: {
                              color: "#0B3B74",
                              fontWeight: 600,
                              border: "none",
                            }, // ⬅️ no border!
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEn ? "Additional Details" : "अतिरिक्त विवरण"}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={markTouched}
                  placeholder={
                    isEn
                      ? "Describe any specific issues or requirements"
                      : "कोई विशेष समस्या या आवश्यकता बताएं"
                  }
                  className="border rounded-lg px-4 py-3 w-full h-28 focus:ring-2 focus:ring-orange-500 outline-none transition border-gray-300"
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading}
                className={`md:col-span-2 flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform ${
                  loading ? "opacity-90 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span className="text-base font-medium">Sending...</span>
                  </div>
                ) : (
                  <span className="text-base font-medium">
                    {isEn ? "Submit Booking" : "बुकिंग सबमिट करें"}
                  </span>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Booking;
