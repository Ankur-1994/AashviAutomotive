import { useEffect, useMemo, useRef, useState } from "react";
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
  service_types: string;
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
    let active = true;

    const fetchContent = async () => {
      try {
        // ✅ Lazy-load Firebase Firestore only when needed
        const { getDb } = await import("../services/firebaseLazy");
        const db = await getDb();

        // ✅ Lazy-load Firestore methods
        const { doc, getDoc } = await import("firebase/firestore");

        const snap = await getDoc(doc(db, "content", "bookings"));
        if (!active || !snap.exists()) return;

        const data = snap.data() as BookingContent;
        setContent(data);

        if (Array.isArray(data.service_types)) {
          setServiceTypes(data.service_types);
        }

        // ✅ Cache for fast reloads
        sessionStorage.setItem("bookings_data", JSON.stringify(data));
      } catch (err) {
        console.error("Error loading booking content:", err);
      }
    };

    // ✅ Try to load from cache first for instant display
    const cached = sessionStorage.getItem("bookings_data");
    if (cached) {
      const data = JSON.parse(cached) as BookingContent;
      setContent(data);
      if (Array.isArray(data.service_types)) {
        setServiceTypes(data.service_types);
      }
    } else {
      fetchContent();
    }

    return () => {
      active = false;
    };
  }, []);

  // ------------------ VALIDATION ------------------
  const errors = useMemo(() => {
    const e: Partial<Record<keyof BookingForm | "customService", string>> = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const isRepeatedDigits = /^(\d)\1{9}$/;

    if (!form.name.trim())
      e.name = isEn ? "Please enter your name" : "कृपया अपना नाम दर्ज करें";

    if (!form.phone.trim()) {
      e.phone = isEn
        ? "Please enter your mobile number"
        : "कृपया अपना मोबाइल नंबर दर्ज करें";
    } else if (
      !phoneRegex.test(form.phone) ||
      isRepeatedDigits.test(form.phone)
    ) {
      e.phone = isEn
        ? "Please enter a valid Indian mobile number"
        : "कृपया एक मान्य भारतीय मोबाइल नंबर दर्ज करें";
    }

    if (!form.brand.trim())
      e.brand = isEn ? "Brand is required" : "ब्रांड आवश्यक है";

    if (!form.vehicle.trim())
      e.vehicle = isEn ? "Model is required" : "मॉडल आवश्यक है";

    if (!form.serviceType)
      e.serviceType = isEn ? "Select a service type" : "सेवा का प्रकार चुनें";

    if (form.serviceType === "Other" && !form.message.trim()) {
      e.customService = isEn
        ? "Please describe your issue"
        : "कृपया अपनी समस्या का वर्णन करें";
    }

    if (!form.date) {
      e.date = isEn ? "Please select a date" : "कृपया एक तारीख़ चुनें";
    } else {
      const selected = new Date(form.date + "T00:00:00");
      const now = new Date();

      // Normalize both to midnight for pure date comparison
      const todayMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const selectedMidnight = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      );

      const isToday = selectedMidnight.getTime() === todayMidnight.getTime();

      // 🧩 Check only if selected day < today (ignore time)
      if (selectedMidnight < todayMidnight) {
        e.date = isEn
          ? "Past dates are not allowed"
          : "पिछली तारीख़ चुनना संभव नहीं";
      } else if (isToday && now.getHours() >= 17) {
        e.date = isEn
          ? "Today's booking is closed after 5 PM"
          : "आज की बुकिंग शाम 5 बजे के बाद बंद है";
      }
    }

    return e;
  }, [form, isEn]);

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
      const { getDb } = await import("../services/firebaseLazy");
      const db = await getDb();
      const { collection, addDoc, Timestamp } = await import(
        "firebase/firestore"
      );
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

      {/* ✅ HERO SECTION */}
      <section
        className="relative flex flex-col justify-center items-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `url(${content.hero_image})`,
          minHeight: "calc(100vh - var(--navbar-height, 80px))",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 sm:px-10 md:px-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-orange-400 drop-shadow-md">
            {isEn ? content.hero_title_en : content.hero_title_hi}
          </h1>

          <p className="text-base sm:text-lg md:text-xl max-w-2xl md:max-w-3xl mx-auto text-gray-200 leading-relaxed">
            {isEn ? content.hero_desc_en : content.hero_desc_hi}
          </p>
        </motion.div>
      </section>

      {/* ✅ FORM SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-white via-[#FDF5EF] to-white">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3B74] mb-6 text-center leading-snug">
            {isEn ? content.form_title_en : content.form_title_hi}
          </h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <p className="text-green-600 text-lg font-medium mb-6">
                {isEn ? content.success_msg_en : content.success_msg_hi}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
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
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                {isEn ? "Book another service" : "एक और सर्विस बुक करें"}
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
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

              {/* Brand */}
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

              {/* Vehicle */}
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

              {/* Additional field for 'Other' service */}
              {form.serviceType === "Other" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEn
                      ? "Describe your issue"
                      : "कृपया अपनी समस्या का वर्णन करें"}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={markTouched}
                    placeholder={
                      isEn
                        ? "Describe your vehicle issue or service need"
                        : "अपनी गाड़ी की समस्या या सर्विस आवश्यकता बताएं"
                    }
                    className={`border rounded-lg px-4 py-3 w-full h-28 focus:ring-2 focus:ring-orange-500 outline-none transition ${
                      (touched.message || submitAttempted) &&
                      errors.customService
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                  {(touched.message || submitAttempted) &&
                    errors.customService && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customService}
                      </p>
                    )}
                </div>
              )}

              {/* Preferred Date */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative" ref={calendarRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEn ? "Preferred Date" : "पसंदीदा तारीख"}
                  </label>

                  {/* Clickable field */}
                  <div
                    onClick={() => setShowCalendar((prev) => !prev)}
                    className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-all font-[inherit] ${
                      (touched.date || submitAttempted) && errors.date
                        ? "border-red-400"
                        : "border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    <span
                      className={`block truncate ${
                        form.date ? "text-gray-800" : "text-gray-500 italic"
                      } text-base font-normal leading-normal`}
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
                    <FaRegCalendarAlt className="text-gray-500 flex-shrink-0 ml-2" />
                  </div>

                  {(touched.date || submitAttempted) && errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}

                  {/* Calendar popup */}
                  <AnimatePresence>
                    {showCalendar && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-full left-0 mt-1 w-full max-w-xs z-50
                     bg-white rounded-xl shadow-2xl border border-gray-200 p-3
                     overflow-hidden" // ← clip any extra month
                      >
                        {/* Scope a tiny CSS override to guarantee single-month layout */}
                        <style>{`
            /* ensure DayPicker shows one month and never overflows */
            .rdp-months { display: block !important; }
            .rdp-month { width: 100%; }
          `}</style>

                        <DayPicker
                          numberOfMonths={1} // ← force single month
                          showOutsideDays={false}
                          pagedNavigation={false}
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
                            if (local < today) return;

                            const iso = `${local.getFullYear()}-${String(
                              local.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                              local.getDate()
                            ).padStart(2, "0")}`;
                            setForm((f) => ({ ...f, date: iso }));
                            setTouched((t) => ({ ...t, date: true }));
                            setShowCalendar(false);
                          }}
                          modifiers={{ disabled: { before: new Date() } }}
                          modifiersStyles={{
                            disabled: { opacity: 0.3, pointerEvents: "none" },
                            selected: {
                              backgroundColor: "#f97316",
                              color: "#fff",
                              fontWeight: 700,
                              borderRadius: "8px",
                            },
                          }}
                          style={{
                            ["--rdp-accent-color" as any]: "#f97316",
                            ["--rdp-accent-background-color" as any]: "#f97316",
                            ["--rdp-outline" as any]: "0",
                          }}
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
                            day_today: { color: "#0B3B74", fontWeight: 600 },
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
                className={`md:col-span-2 flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 sm:py-4 rounded-lg shadow-md transition-transform ${
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
                  <span className="text-base sm:text-lg font-medium">
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
